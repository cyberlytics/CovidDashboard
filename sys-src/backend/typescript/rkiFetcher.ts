import Papa from "papaparse";
import getFromCache from "./filestore";
import fetch from "node-fetch";
import { addDays, getMidnightUTC, last2ElementsPerMap, MS_PER_DAY, parse, parseRKIDate, stringify, } from "./util";

const RKIDataPath = "https://www.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data";
//    "https://opendata.arcgis.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads/data?format=csv&spatialRefId=4326";

const RKIPopulationDataPath =
    "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=EWZ,last_update,cases7_per_100k,AdmUnitId,cases7_lk,death7_lk&returnGeometry=false&outSR=4326&f=json";
const RKIVaccinationDataPath =
    "https://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/Impffortschritt_Deutschland_V4/FeatureServer/0/query?f=json&where=1%3D1&orderByFields=Datum%20asc&outFields=*&resultType=standard";

export type RKIData = {
    StateId: number;
    CountyId: number;
    TotalCases: number;
    Recovered: number;
    Deaths: number;
    ActiveCases: number;
    Incidence7: number;
    Population: number;
    Date: Date;
};

type RKIPopulationData = {
    CountyId: number;
    Population: number;
    Cases7: number;
    Incidence7: number;
    LastUpdate: number;
    Deaths7: number;
};

export type RKIRawData = {
    StateId: number;
    CountyId: number;
    Agegroup: "00-04" | "05-14" | "15-34" | "35-59" | "60-79" | "80+" | "unknown";
    Sex: "m" | "f" | "u";
    NewCases: number;
    NewDeaths: number;
    NewRecovered: number;
    Date: Date;
    County: string;
    State: string;
};

export type Names = {
    Counties: Map<number, string>;
    States: Map<number, string>;
};

export type RKIVaccinationData = {
    StateId: number;
    Date: Date;
    SumVaccinations: number;
    SumFirstVaccinations: number;
    SumSecondVaccinations: number;
    ProportionFirstVaccinations: number;
    ProportionSecondVaccinations: number;
    SumFirstBioNTech: number;
    SumSecondBioNTech: number;
    SumFirstAstraZeneca: number;
    SumSecondAstraZeneca: number;
    SumFirstModerna: number;
    SumSecondModerna: number;
    SumBioNTech: number;
    SumAstraZeneca: number;
    SumModerna: number;
    SumJohnsonAndJohnson: number;
};

export type IncidencesDiff = {
    DeltaDeaths: number;
    DeltaIncidence7: number;
    DeltaRecovered: number;
    DeltaTotalCases: number;
};

export type VaccinesDiff = {
    DeltaSumVaccinations: number;
    DeltaSumFirstVaccinations: number;
    DeltaSumSecondVaccinations: number;
    DeltaProportionFirstVaccinations: number;
    DeltaProportionSecondVaccinations: number;
    DeltaSumFirstBioNTech: number;
    DeltaSumSecondBioNTech: number;
    DeltaSumFirstAstraZeneca: number;
    DeltaSumSecondAstraZeneca: number;
    DeltaSumFirstModerna: number;
    DeltaSumSecondModerna: number;
    DeltaSumBioNTech: number;
    DeltaSumAstraZeneca: number;
    DeltaSumModerna: number;
    DeltaSumJohnsonAndJohnson: number;
};

function convertAgegroup(rkiAgeGroup: string): RKIRawData["Agegroup"] {
    switch (rkiAgeGroup) {
        case "A00-A04":
            return "00-04";
        case "A05-A14":
            return "05-14";
        case "A15-A34":
            return "15-34";
        case "A35-A59":
            return "35-59";
        case "A60-A79":
            return "60-79";
        case "A80+":
            return "80+";
    }
    return "unknown";
}

function convertSex(rkiSex: string): RKIRawData["Sex"] {
    switch (rkiSex) {
        case "M":
            return "m";
        case "W":
            return "f";
    }
    return "u";
}

const headerTranslation = (function () {
    const map = new Map<string, string>();
    map.set("ObjectId", "ObjectId");
    map.set("IdBundesland", "StateId");
    map.set("Bundesland", "State");
    map.set("IdLandkreis", "CountyId");
    map.set("Landkreis", "County");
    map.set("Altersgruppe", "Agegroup");
    map.set("Geschlecht", "Sex");
    map.set("AnzahlFall", "Cases");
    map.set("AnzahlTodesfall", "Deaths");
    map.set("AnzahlGenesen", "Recovered");
    map.set("Meldedatum", "ReportDate");
    map.set("NeuerFall", "NewCaseType");
    map.set("NeuerTodesfall", "NewDeathType");
    map.set("NeuGenesen", "NewRecoveredType");
    map.set("Refdatum", "RefDate");
    map.set("IstErkrankungsbeginn", "IsDiseaseBegin");
    map.set("Datenstand", "LastUpdate");
    map.set("Altersgruppe2", "NotUsed");
    return map;
})(); // IIFE

function fullData(): Promise<RKIRawData[]> {
    return new Promise((resolve, reject) => {
        getFromCache<RKIRawData[]>(
            "fullData.csv",
            () => {
                return new Promise((resolve, reject) => {
                    fetch(RKIDataPath)
                        .then((d) => {
                            d.text().then(resolve).catch(reject);
                        })
                        .catch(reject);
                });
            },
            (t) => {
                return new Promise<any>((resolve, reject) => {
                    const result = new Array<RKIRawData>();
                    Papa.parse(t, {
                        header: true,
                        transformHeader: function (s: string) {
                            return headerTranslation.get(s)!;
                        },
                        dynamicTyping: true,
                        skipEmptyLines: "greedy",
                        step: function (results, parser) {
                            if (typeof results.data === "object") {
                                transformToRKIRawData(results.data);
                            } else {
                                (results.data as []).forEach(transformToRKIRawData);
                            }
                            if (results.errors && results.errors.length > 0) {
                                reject(results.errors);
                            }
                        },
                    });

                    function transformToRKIRawData(e: any) {
                        let newCases = 0;
                        let newDeaths = 0;
                        let newRecovered = 0;

                        if (e.NewDeathType === -9 && e.NewRecoveredType === -9) {
                            newCases = e.Cases;
                        }
                        newDeaths = e.Deaths;
                        newRecovered = e.Recovered;

                        result.push({
                            StateId: e.StateId,
                            CountyId: e.CountyId,
                            Agegroup: convertAgegroup(e.Agegroup),
                            Sex: convertSex(e.Sex),
                            //parseRKIDate(e.IsDiseaseBegin === 1 ? e.RefDate : e.ReportDate),
                            Date: parseRKIDate(e.ReportDate),
                            NewCases: newCases,
                            NewDeaths: newDeaths,
                            NewRecovered: newRecovered,
                            County: e.County,
                            State: e.State,
                        });
                    }

                    resolve(result);
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}

const beginDate = getMidnightUTC(new Date("2020-01-01T00:00:00Z"));

export function dataPerCounty(): Promise<Map<number, Map<number, RKIData>>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, Map<number, RKIData>>>(
            "perCounty.json",
            () => {
                return new Promise((resolve, reject) => {
                    getFromCache<Map<number, RKIPopulationData>>(
                        "population.json",
                        () => {
                            return new Promise((resolve, reject) => {
                                fetch(RKIPopulationDataPath)
                                    .then((d) => {
                                        d.json()
                                            .then((j) => {
                                                const map = new Map<number, RKIPopulationData>();
                                                j.features.forEach((x: any) => {
                                                    const e = x.attributes;
                                                    map.set(e.AdmUnitId, {
                                                        CountyId: e.AdmUnitId,
                                                        Cases7: e.cases7_lk,
                                                        Deaths7: e.death7_lk,
                                                        LastUpdate: e.last_update,
                                                        Population: e.EWZ,
                                                        Incidence7: e.cases7_per_100k,
                                                    });
                                                });
                                                resolve(stringify(map));
                                            })
                                            .catch(reject);
                                    })
                                    .catch(reject);
                            });
                        },
                        (t) => {
                            return new Promise<Map<number, RKIPopulationData>>(
                                (resolve, reject) => {
                                    resolve(parse(t));
                                }
                            );
                        }
                    )
                        .then((p) => {
                            fullData()
                                .then((d) => {
                                    // Sort by date to optimize for-loop a couple lines down
                                    d.sort((a, b) => a.Date.valueOf() - b.Date.valueOf());

                                    const groupPerCounty = new Map<number, RKIRawData[]>();
                                    d.forEach((e) => {
                                        if (!groupPerCounty.has(e.CountyId)) {
                                            groupPerCounty.set(e.CountyId, []);
                                        }
                                        groupPerCounty.get(e.CountyId)!.push(e);
                                    });

                                    const result = new Map<number, Map<number, RKIData>>();

                                    function expandData(
                                        map: Map<number, RKIData>,
                                        oldDay: number,
                                        newDay: number
                                    ): void {
                                        let oldData = map.get(oldDay);
                                        if (typeof oldData === "undefined") {
                                            throw "oldDay does not exist in map";
                                        }
                                        //console.log("Expansion called for", oldDay, "to", newDay);
                                        for (
                                            let date = oldDay + MS_PER_DAY;
                                            date <= newDay;
                                            date += MS_PER_DAY
                                        ) {
                                            //console.log("    Expanding from", oldDay, "to", date);

                                            map.set(date, {
                                                ActiveCases: oldData.ActiveCases,
                                                CountyId: oldData.CountyId,
                                                Date: new Date(date),
                                                Deaths: oldData.Deaths,
                                                Incidence7: -1,
                                                Population: 0,
                                                Recovered: oldData.Recovered,
                                                StateId: oldData.StateId,
                                                TotalCases: oldData.TotalCases,
                                            });
                                        }
                                    }

                                    function sumToMap(
                                        map: Map<number, RKIData>,
                                        data: RKIRawData
                                    ): void {
                                        const dateNumber = data.Date.valueOf();
                                        try {
                                            map.get(dateNumber)!.TotalCases +=
                                                data.NewCases + data.NewDeaths + data.NewRecovered;
                                            map.get(dateNumber)!.Deaths += data.NewDeaths;
                                            map.get(dateNumber)!.Recovered += data.NewRecovered;
                                        }
                                        catch (ex) {
                                            console.log("Error occured while summing for date:", data.Date, dateNumber, data);
                                            throw ex;
                                        }
                                    }

                                    groupPerCounty.forEach((values, countyId) => {
                                        // Aggregate all data before 2020-01-01
                                        const countyMap = new Map<number, RKIData>();
                                        countyMap.set(beginDate.valueOf(), {
                                            ActiveCases: 0,
                                            CountyId: countyId,
                                            Date: beginDate,
                                            Deaths: 0,
                                            Incidence7: -1,
                                            Population: 0, // Set afterwards
                                            Recovered: 0,
                                            StateId: values[0]?.StateId,
                                            TotalCases: 0,
                                        });
                                        let i: number;
                                        for (i = 0; i < values.length; i++) {
                                            const e = values[i];
                                            if (e.Date < beginDate) {
                                                sumToMap(countyMap, e);
                                            } else {
                                                // Optimization because of sorted array
                                                break;
                                            }
                                        }
                                        // Now we have the aggregation for all data before 2020-01-01
                                        let currentDate = beginDate;
                                        for (; i < values.length; i++) {
                                            const e = values[i];
                                            if (e.Date.valueOf() > currentDate.valueOf()) {
                                                // We reached a new day
                                                // -> copy everything from yesterday and continue with aggregation
                                                expandData(
                                                    countyMap,
                                                    currentDate.valueOf(),
                                                    e.Date.valueOf()
                                                );
                                                currentDate = e.Date;
                                            }
                                            sumToMap(countyMap, e);
                                        }

                                        // Now expand the data up to yesterday (if some entries are missing)
                                        // There can not be any data of today because RKI's data submission deadline is at midnight.
                                        expandData(
                                            countyMap,
                                            currentDate.valueOf(),
                                            getMidnightUTC(addDays(new Date(), -1)).valueOf()
                                        );

                                        calculate7DaysIncidence(countyMap, p);
                                        result.set(countyId, countyMap);
                                    });

                                    const germanyData = new Map<number, RKIData>();
                                    result.forEach((historyData, countyId) => {
                                        historyData.forEach((rkiData, date) => {
                                            if (!germanyData.has(date)) {
                                                germanyData.set(date, {
                                                    ActiveCases: 0,
                                                    CountyId: 0,
                                                    Date: new Date(date),
                                                    Deaths: 0,
                                                    Incidence7: 0,
                                                    Population: 0,
                                                    Recovered: 0,
                                                    StateId: 0,
                                                    TotalCases: 0,
                                                });
                                            }
                                            germanyData.get(date)!.ActiveCases += rkiData.ActiveCases;
                                            germanyData.get(date)!.Deaths += rkiData.Deaths;
                                            germanyData.get(date)!.Population += rkiData.Population;
                                            germanyData.get(date)!.Recovered += rkiData.Recovered;
                                            germanyData.get(date)!.TotalCases += rkiData.TotalCases;
                                        });
                                    });
                                    const germanyDataSorted = new Map(
                                        [...germanyData.entries()].sort((a, b) => a[0] - b[0])
                                    );
                                    calculate7DaysIncidence(germanyDataSorted, undefined);
                                    result.set(0, germanyDataSorted);
                                    resolve(stringify(result));
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(parse(t));
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}

function calculate7DaysIncidence(
    map: Map<number, RKIData>,
    p: Map<number, RKIPopulationData> | undefined
): void {
    map.forEach((r, d) => {
        r.ActiveCases = r.TotalCases - r.Deaths - r.Recovered;
        if (p !== undefined) {
            r.Population = p.get(r.CountyId)?.Population ?? 1;
        }
        const dateMinus7 = addDays(new Date(d), -7).valueOf();
        if (map.has(dateMinus7)) {
            r.Incidence7 =
                ((r.TotalCases - map.get(dateMinus7)!.TotalCases) / r.Population) *
                100_000;
        }
    });
}

export function getNames(): Promise<Names> {
    return new Promise((resolve, reject) => {
        getFromCache<Names>(
            "names.json",
            () => {
                return new Promise((resolve, reject) => {
                    fullData()
                        .then((d) => {
                            const counties = new Map<number, string>();
                            const states = new Map<number, string>();

                            d.forEach((v) => {
                                if (!counties.has(v.CountyId)) {
                                    counties.set(v.CountyId, v.County);
                                }
                                if (!states.has(v.StateId)) {
                                    states.set(v.StateId, v.State);
                                }
                            });

                            resolve(stringify({ Counties: counties, States: states }));
                        })
                        .catch(reject);
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(parse(t));
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function vaccinationPerState(): Promise<Map<number, Map<number, RKIVaccinationData>>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, Map<number, RKIVaccinationData>>>(
            "vaccination.json",
            () => {
                return new Promise<string>((resolve, reject) => {
                    fetch(RKIVaccinationDataPath)
                        .then((d) => {
                            d.json()
                                .then((j) => resolve(stringify(transformVaccinationData(j))))
                                .catch(reject);
                        })
                        .catch(reject);

                    function transformVaccinationData(
                        obj: any
                    ): Map<number, Map<number, RKIVaccinationData>> {
                        const map = new Map<number, Map<number, RKIVaccinationData>>();
                        obj.features.forEach(({ attributes }: any) => {
                            const stateIdentifier = attributes.RS;
                            if (stateIdentifier === "DE") {
                                return;
                            } // Ignore "Impfzentren Bund*"
                            const stateId =
                                stateIdentifier === "GE" ? 0 : parseInt(stateIdentifier);
                            if (!map.has(stateId)) {
                                map.set(stateId, new Map<number, RKIVaccinationData>());
                            }

                            if (!map.get(stateId)!.has(attributes.Datum)) {
                                map.get(stateId)!.set(attributes.Datum, {
                                    Date: new Date(attributes.Datum),
                                    ProportionFirstVaccinations: 0,
                                    ProportionSecondVaccinations: 0,
                                    StateId: stateId,
                                    SumFirstAstraZeneca: 0,
                                    SumFirstBioNTech: 0,
                                    SumFirstModerna: 0,
                                    SumFirstVaccinations: 0,
                                    SumSecondAstraZeneca: 0,
                                    SumSecondBioNTech: 0,
                                    SumSecondModerna: 0,
                                    SumSecondVaccinations: 0,
                                    SumVaccinations: 0,
                                    SumAstraZeneca: 0,
                                    SumBioNTech: 0,
                                    SumJohnsonAndJohnson: 0,
                                    SumModerna: 0,
                                });
                            }

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "ProportionFirstVaccinations",
                                attributes.AlleImpfstellenImpfquoteEineImp
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "ProportionSecondVaccinations",
                                attributes.AlleImpfstellenImpfquoteDurchge
                            );

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumVaccinations",
                                attributes.AlleImpfstellenSummeImpfungen
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumFirstVaccinations",
                                attributes.AlleImpfstellenSummeErstimpfung
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumSecondVaccinations",
                                attributes.AlleImpfstellenSummeDurchgeimpf
                            );

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumFirstAstraZeneca",
                                attributes.EineImpfungAstraZeneca
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumSecondAstraZeneca",
                                attributes.DurchgeimpftAstraZeneca
                            );
                            addInMap(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumAstraZeneca",
                                "SumFirstAstraZeneca",
                                "SumSecondAstraZeneca"
                            );

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumFirstBioNTech",
                                attributes.EineImpfungBioNTech
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumSecondBioNTech",
                                attributes.DurchgeimpftBioNTech
                            );
                            addInMap(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumBioNTech",
                                "SumFirstBioNTech",
                                "SumSecondBioNTech"
                            );

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumFirstModerna",
                                attributes.EineImpfungModerna
                            );
                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumSecondModerna",
                                attributes.DurchgeimpftModerna
                            );
                            addInMap(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumModerna",
                                "SumFirstModerna",
                                "SumSecondModerna"
                            );

                            add(
                                map,
                                stateId,
                                attributes.Datum,
                                "SumJohnsonAndJohnson",
                                attributes.DurchgeimpftJanssen
                            );

                            function add(
                                map: Map<number, Map<number, RKIVaccinationData>>,
                                stateId: number,
                                date: number,
                                property: keyof RKIVaccinationData,
                                ...values: any[]
                            ) {
                                if (typeof values !== "undefined" && values !== null) {
                                    values.forEach((value) => {
                                        if (
                                            typeof value !== "undefined" &&
                                            value !== null &&
                                            !isNaN(value)
                                        ) {
                                            map.get(stateId)!.get(date)![property] += value;
                                        }
                                    });
                                }
                            }

                            function addInMap(
                                map: Map<number, Map<number, RKIVaccinationData>>,
                                stateId: number,
                                date: number,
                                property: keyof RKIVaccinationData,
                                ...values: (keyof RKIVaccinationData)[]
                            ) {
                                values.forEach((value) => {
                                    (map.get(stateId)!.get(date)![property] as number) += map
                                        .get(stateId)!
                                        .get(date)![value] as number;
                                });
                            }
                        });
                        /*map.forEach((m, stateId) => {
                                                            map.set(stateId, new Map([...m.entries()].sort((a, b) => a[0] - b[0])));
                                                        });*/
                        return map;
                    }
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(parse(t));
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function dataPerCountyDiff(): Promise<Map<number, IncidencesDiff>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, IncidencesDiff>>(
            "perCounty.diff.json",
            () => {
                return new Promise((resolve, reject) => {
                    dataPerCounty()
                        .then((d) => {
                            const incidences = last2ElementsPerMap(d);
                            const data = new Map<number, IncidencesDiff>();
                            incidences.forEach(([penultimate, last], countyId) => {
                                data.set(countyId, {
                                    DeltaDeaths: last.Deaths - penultimate.Deaths,
                                    DeltaIncidence7: last.Incidence7 - penultimate.Incidence7,
                                    DeltaRecovered: last.Recovered - penultimate.Recovered,
                                    DeltaTotalCases: last.TotalCases - penultimate.TotalCases,
                                });
                            });
                            resolve(stringify(data));
                        })
                        .catch(reject);
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(parse(t));
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function vaccinationPerStateDiff(): Promise<Map<number, VaccinesDiff>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, VaccinesDiff>>(
            "vaccination.diff.json",
            () => {
                return new Promise((resolve, reject) => {
                    vaccinationPerState()
                        .then((v) => {
                            const vaccines = last2ElementsPerMap(v);
                            const data = new Map<number, VaccinesDiff>();
                            vaccines.forEach(([penultimate, last], stateId) => {
                                data.set(stateId, {
                                    DeltaSumVaccinations:
                                        last.SumVaccinations - penultimate.SumVaccinations,
                                    DeltaSumFirstVaccinations:
                                        last.SumFirstVaccinations - penultimate.SumFirstVaccinations,
                                    DeltaSumSecondVaccinations:
                                        last.SumSecondVaccinations - penultimate.SumSecondVaccinations,
                                    DeltaProportionFirstVaccinations:
                                        last.ProportionFirstVaccinations -
                                        penultimate.ProportionFirstVaccinations,
                                    DeltaProportionSecondVaccinations:
                                        last.ProportionSecondVaccinations -
                                        penultimate.ProportionSecondVaccinations,
                                    DeltaSumFirstBioNTech:
                                        last.SumFirstBioNTech - penultimate.SumFirstBioNTech,
                                    DeltaSumSecondBioNTech:
                                        last.SumSecondBioNTech - penultimate.SumSecondBioNTech,
                                    DeltaSumFirstAstraZeneca:
                                        last.SumFirstAstraZeneca - penultimate.SumFirstAstraZeneca,
                                    DeltaSumSecondAstraZeneca:
                                        last.SumSecondAstraZeneca - penultimate.SumSecondAstraZeneca,
                                    DeltaSumFirstModerna:
                                        last.SumFirstModerna - penultimate.SumFirstModerna,
                                    DeltaSumSecondModerna:
                                        last.SumSecondModerna - penultimate.SumSecondModerna,
                                    DeltaSumBioNTech: last.SumBioNTech - penultimate.SumBioNTech,
                                    DeltaSumAstraZeneca: last.SumAstraZeneca - penultimate.SumAstraZeneca,
                                    DeltaSumModerna: last.SumModerna - penultimate.SumModerna,
                                    DeltaSumJohnsonAndJohnson:
                                        last.SumJohnsonAndJohnson - penultimate.SumJohnsonAndJohnson,
                                });
                            });
                            resolve(stringify(data));
                        })
                        .catch(reject);
                });
            },
            (t) => {
                return new Promise((resolve, reject) => {
                    resolve(parse(t));
                });
            }
        )
            .then(resolve)
            .catch(reject);
    });
}
