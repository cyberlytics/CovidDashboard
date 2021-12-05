import Papa from "papaparse";
import getFromCache from "./filestore";
import fetch from "node-fetch";
import { addDays, getMidnightUTC, last2ElementsPerMap, MS_PER_DAY, parse, parseRKIDate, parseRKIVaccinationDate, roundTo, stringify, } from "./util";

const RKIDataPath = "https://www.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data";
//    "https://opendata.arcgis.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads/data?format=csv&spatialRefId=4326";

const RKIPopulationDataPath =
    "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=EWZ,last_update,cases7_per_100k,AdmUnitId,cases7_lk,death7_lk&returnGeometry=false&outSR=4326&f=json";
const RKIVaccinationDataPath =
    "https://raw.githubusercontent.com/robert-koch-institut/COVID-19-Impfungen_in_Deutschland/master/Aktuell_Deutschland_Bundeslaender_COVID-19-Impfungen.csv";
//"https://services.arcgis.com/OLiydejKCZTGhvWg/arcgis/rest/services/Impffortschritt_Deutschland_V4/FeatureServer/0/query?f=json&where=1%3D1&orderByFields=Datum%20asc&outFields=*&resultType=standard";

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
    StateId: number;
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

type VaccineType = 'Comirnaty' | 'Moderna' | 'AstraZeneca' | 'Janssen';

type RKIVaccinationDataRaw = {
    Date: Date;
    StateId: number;
    VaccineType: VaccineType;
    VaccineSeries: number;
    Count: number;
};

export type RKIVaccinationData = {
    StateId: number;
    Date: Date;
    SumVaccinations: number;
    SumFirstVaccinations: number;
    SumSecondVaccinations: number;
    SumThirdVaccinations: number;
    ProportionFirstVaccinations: number;
    ProportionSecondVaccinations: number;
    ProportionThirdVaccinations: number;
    SumFirstBioNTech: number;
    SumSecondBioNTech: number;
    SumThirdBioNTech: number;
    SumFirstAstraZeneca: number;
    SumSecondAstraZeneca: number;
    SumThirdAstraZeneca: number;
    SumFirstModerna: number;
    SumSecondModerna: number;
    SumThirdModerna: number;
    SumBioNTech: number;
    SumAstraZeneca: number;
    SumModerna: number;
    SumJohnsonAndJohnson: number;
    SumThirdJohnsonAndJohnson: number;
};

const rkiVaccinationDataZeroObject = {
    ProportionFirstVaccinations: 0,
    ProportionSecondVaccinations: 0,
    ProportionThirdVaccinations: 0,
    SumFirstAstraZeneca: 0,
    SumFirstBioNTech: 0,
    SumFirstModerna: 0,
    SumFirstVaccinations: 0,
    SumSecondAstraZeneca: 0,
    SumSecondBioNTech: 0,
    SumSecondModerna: 0,
    SumSecondVaccinations: 0,
    SumThirdAstraZeneca: 0,
    SumThirdBioNTech: 0,
    SumThirdJohnsonAndJohnson: 0,
    SumThirdModerna: 0,
    SumThirdVaccinations: 0,
    SumVaccinations: 0,
    SumAstraZeneca: 0,
    SumBioNTech: 0,
    SumJohnsonAndJohnson: 0,
    SumModerna: 0,
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
    DeltaSumThirdVaccinations: number;
    DeltaProportionFirstVaccinations: number;
    DeltaProportionSecondVaccinations: number;
    DeltaProportionThirdVaccinations: number;
    DeltaSumFirstBioNTech: number;
    DeltaSumSecondBioNTech: number;
    DeltaSumThirdBioNTech: number;
    DeltaSumFirstAstraZeneca: number;
    DeltaSumSecondAstraZeneca: number;
    DeltaSumThirdAstraZeneca: number;
    DeltaSumFirstModerna: number;
    DeltaSumSecondModerna: number;
    DeltaSumThirdModerna: number;
    DeltaSumBioNTech: number;
    DeltaSumAstraZeneca: number;
    DeltaSumModerna: number;
    DeltaSumJohnsonAndJohnson: number;
    DeltaSumThirdJohnsonAndJohnson: number;
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

const vaccineHeaderTranslation = (function () {
    const map = new Map<string, string>();
    map.set("Impfdatum", "Date");
    map.set("BundeslandId_Impfort", "StateId");
    map.set("Impfstoff", "VaccineType");
    map.set("Impfserie", "VaccineSeries");
    map.set("Anzahl", "Count");
    return map;
})(); // IIFE

const vaccineAdditionTargets = (function () {
    const map = new Map<VaccineType, (keyof RKIVaccinationData)[]>();
    map.set("Comirnaty", ["SumFirstBioNTech", "SumSecondBioNTech", "SumThirdBioNTech"]);
    map.set("AstraZeneca", ["SumFirstAstraZeneca", "SumSecondAstraZeneca", "SumThirdAstraZeneca"]);
    map.set("Moderna", ["SumFirstModerna", "SumSecondModerna", "SumThirdModerna"]);
    map.set("Janssen", ["SumJohnsonAndJohnson", "SumThirdJohnsonAndJohnson", "SumThirdJohnsonAndJohnson"]);
    return map;
})(); // IIFE

function expandData<T>(
    map: Map<number, T>,
    oldDay: number,
    newDay: number,
    copy: (obj: T, date: number) => T,
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
        map.set(date, copy(oldData, date));
    }
}

function expandDataRKIData(oldData: RKIData, date: number): RKIData {
    return {
        ActiveCases: oldData.ActiveCases,
        CountyId: oldData.CountyId,
        Date: new Date(date),
        Deaths: oldData.Deaths,
        Incidence7: -1,
        Population: 0,
        Recovered: oldData.Recovered,
        StateId: oldData.StateId,
        TotalCases: oldData.TotalCases,
    };
}

function expandDataVaccinationData(oldData: RKIVaccinationData, date: number): RKIVaccinationData {
    const copy = { ...oldData };
    copy.Date = new Date(date);
    return copy;
}



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

function populationData(): Promise<Map<number, RKIPopulationData>> {
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
                                            StateId: Math.floor(e.AdmUnitId / 1000),
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
            .then(resolve)
            .catch(reject);
    });
}

export function dataPerCounty(): Promise<Map<number, Map<number, RKIData>>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, Map<number, RKIData>>>(
            "perCounty.json",
            () => {
                return new Promise((resolve, reject) => {
                    populationData()
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
                                                    e.Date.valueOf(),
                                                    expandDataRKIData,
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
                                            getMidnightUTC(addDays(new Date(), -1)).valueOf(),
                                            expandDataRKIData,
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

function calculateVaccinationSums(
    map: Map<number, RKIVaccinationData>,
): void {
    map.forEach((v, d) => {
        v.SumAstraZeneca = v.SumFirstAstraZeneca + v.SumSecondAstraZeneca + v.SumThirdAstraZeneca;
        v.SumBioNTech = v.SumFirstBioNTech + v.SumSecondBioNTech + v.SumThirdBioNTech;
        v.SumModerna = v.SumFirstModerna + v.SumSecondModerna + v.SumThirdModerna;
        v.SumJohnsonAndJohnson = v.SumJohnsonAndJohnson + v.SumThirdJohnsonAndJohnson;

        v.SumFirstVaccinations = v.SumFirstAstraZeneca + v.SumFirstBioNTech + v.SumFirstModerna + v.SumJohnsonAndJohnson;
        v.SumSecondVaccinations = v.SumSecondAstraZeneca + v.SumSecondBioNTech + v.SumSecondModerna;
        v.SumThirdVaccinations = v.SumThirdAstraZeneca + v.SumThirdBioNTech + v.SumThirdModerna + v.SumThirdJohnsonAndJohnson;

        v.SumVaccinations = v.SumFirstVaccinations + v.SumSecondVaccinations + v.SumThirdVaccinations;
    });
}

function calculateVaccinationTotalSums(
    map: Map<number, Map<number, RKIVaccinationData>>
): Map<number, RKIVaccinationData> {
    const sum = new Map<number, RKIVaccinationData>();
    map.forEach((values, stateId) => {
        values.forEach((value, date) => {
            if (!sum.has(date)) {
                sum.set(date, {
                    ...rkiVaccinationDataZeroObject,
                    Date: new Date(date),
                    StateId: 0
                });
            }
            Object.keys(value).forEach(k => {
                const key = k as keyof RKIVaccinationData;
                if (key !== 'StateId' && key !== 'Date') {
                    sum.get(date)![key] += value[key];
                }
            });
        });
    });
    return sum;
}

function calculateVaccinationProportions(
    map: Map<number, Map<number, RKIVaccinationData>>
): Promise<Map<number, Map<number, RKIVaccinationData>>> {
    return new Promise((resolve, reject) => {
        populationData()
            .then(p => {
                const populationPerState = new Map<number, number>();
                let germany = 0;
                p.forEach(countyPopulation => {
                    populationPerState.set(countyPopulation.StateId, (populationPerState.get(countyPopulation.StateId) ?? 0) + countyPopulation.Population);
                    germany += countyPopulation.Population;
                });
                populationPerState.set(0, germany);
                map.forEach((values, stateId) => {
                    values.forEach(data => {
                        if (populationPerState.has(stateId)) {
                            const population = populationPerState.get(stateId)!;
                            data.ProportionFirstVaccinations = roundTo(data.SumFirstVaccinations / population * 100, 1);
                            data.ProportionSecondVaccinations = roundTo(data.SumSecondVaccinations / population * 100, 1);
                            data.ProportionThirdVaccinations = roundTo(data.SumThirdVaccinations / population * 100, 1);
                        }
                        else {
                            data.ProportionFirstVaccinations = Number.NaN;
                            data.ProportionSecondVaccinations = Number.NaN;
                            data.ProportionThirdVaccinations = Number.NaN;
                        }
                    });
                });
                resolve(map);
            })
            .catch(reject);
    });
}

const vaccineBeginDate = getMidnightUTC(new Date("2020-12-27T00:00:00Z"));
export function vaccinationPerState(): Promise<Map<number, Map<number, RKIVaccinationData>>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, Map<number, RKIVaccinationData>>>(
            "vaccination.json",
            () => {
                return new Promise<string>((resolve, reject) => {
                    fetch(RKIVaccinationDataPath)
                        .then((d) => {
                            d.text()
                                .then((t) => {
                                    transformVaccinationData(t)
                                        .then(obj => resolve(stringify(obj)))
                                        .catch(reject);
                                })
                                .catch(reject);
                        })
                        .catch(reject);

                    function transformVaccinationData(
                        csv: string
                    ): Promise<Map<number, Map<number, RKIVaccinationData>>> {
                        const parseResult = new Array<RKIVaccinationDataRaw>();
                        Papa.parse(csv, {
                            header: true,
                            transformHeader: s => vaccineHeaderTranslation.get(s)!,
                            dynamicTyping: true,
                            skipEmptyLines: 'greedy',
                            step: (results, parser) => {
                                if (typeof results.data === 'object') {
                                    transformToVaccineRawData(results.data);
                                } else {
                                    (results.data as []).forEach(transformToVaccineRawData);
                                }
                                if (results.errors && results.errors.length > 0) {
                                    reject(results.errors);
                                }
                            },
                        });

                        function transformToVaccineRawData(e: any) {
                            parseResult.push({
                                Date: parseRKIVaccinationDate(e.Date),
                                Count: e.Count,
                                StateId: e.StateId,
                                VaccineSeries: e.VaccineSeries,
                                VaccineType: e.VaccineType,
                            });
                        }

                        // Sort by date to optimize for-loop
                        parseResult.sort((a, b) => a.Date.valueOf() - b.Date.valueOf());
                        const groupPerState = new Map<number, RKIVaccinationDataRaw[]>();
                        parseResult.forEach(e => {
                            if (!groupPerState.has(e.StateId)) {
                                groupPerState.set(e.StateId, []);
                            }
                            groupPerState.get(e.StateId)!.push(e);
                        });

                        function sumToMap(
                            map: Map<number, RKIVaccinationData>,
                            data: RKIVaccinationDataRaw
                        ): void {
                            const dateNumber = data.Date.valueOf();
                            try {
                                const target = vaccineAdditionTargets.get(data.VaccineType)![data.VaccineSeries - 1]!;
                                (map.get(dateNumber)![target] as number) += data.Count;
                            }
                            catch (ex) {
                                console.log("Error occured while summing vaccination data for date:", data.Date, dateNumber, data);
                                throw ex;
                            }
                        }

                        const map = new Map<number, Map<number, RKIVaccinationData>>();
                        groupPerState.forEach((values, stateId) => {
                            const stateMap = new Map<number, RKIVaccinationData>();
                            stateMap.set(vaccineBeginDate.valueOf(), {
                                ...rkiVaccinationDataZeroObject,
                                Date: new Date(vaccineBeginDate.valueOf()),
                                StateId: stateId,
                            });

                            let i: number;
                            for (i = 0; i < values.length; i++) {
                                const e = values[i];
                                if (e.Date < vaccineBeginDate) {
                                    sumToMap(stateMap, e);
                                } else {
                                    // Optimization because of sorted array
                                    break;
                                }
                            }

                            // Now we have the aggregation for all data before 2020-12-27
                            let currentDate = vaccineBeginDate;
                            for (; i < values.length; i++) {
                                const e = values[i];
                                if (e.Date.valueOf() > currentDate.valueOf()) {
                                    // We reached a new day
                                    // -> copy everything from yesterday and continue with aggregation
                                    expandData(
                                        stateMap,
                                        currentDate.valueOf(),
                                        e.Date.valueOf(),
                                        expandDataVaccinationData,
                                    );
                                    currentDate = e.Date;
                                }
                                sumToMap(stateMap, e);
                            }

                            // Now expand the data up to yesterday (if some entries are missing)
                            // There can not be any data of today because RKI's data submission deadline is at midnight.
                            expandData(
                                stateMap,
                                currentDate.valueOf(),
                                getMidnightUTC(addDays(new Date(), -1)).valueOf(),
                                expandDataVaccinationData,
                            );
                            calculateVaccinationSums(stateMap);
                            map.set(stateId, stateMap);
                        });
                        map.set(0, calculateVaccinationTotalSums(map));
                        return calculateVaccinationProportions(map);
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
                                    DeltaSumVaccinations: last.SumVaccinations - penultimate.SumVaccinations,
                                    DeltaSumFirstVaccinations: last.SumFirstVaccinations - penultimate.SumFirstVaccinations,
                                    DeltaSumSecondVaccinations: last.SumSecondVaccinations - penultimate.SumSecondVaccinations,
                                    DeltaSumThirdVaccinations: last.SumThirdVaccinations - penultimate.SumThirdVaccinations,
                                    DeltaProportionFirstVaccinations: last.ProportionFirstVaccinations - penultimate.ProportionFirstVaccinations,
                                    DeltaProportionSecondVaccinations: last.ProportionSecondVaccinations - penultimate.ProportionSecondVaccinations,
                                    DeltaProportionThirdVaccinations: last.ProportionThirdVaccinations - penultimate.ProportionThirdVaccinations,
                                    DeltaSumFirstBioNTech: last.SumFirstBioNTech - penultimate.SumFirstBioNTech,
                                    DeltaSumSecondBioNTech: last.SumSecondBioNTech - penultimate.SumSecondBioNTech,
                                    DeltaSumThirdBioNTech: last.SumThirdBioNTech - penultimate.SumThirdBioNTech,
                                    DeltaSumFirstAstraZeneca: last.SumFirstAstraZeneca - penultimate.SumFirstAstraZeneca,
                                    DeltaSumSecondAstraZeneca: last.SumSecondAstraZeneca - penultimate.SumSecondAstraZeneca,
                                    DeltaSumThirdAstraZeneca: last.SumThirdAstraZeneca - penultimate.SumThirdAstraZeneca,
                                    DeltaSumFirstModerna: last.SumFirstModerna - penultimate.SumFirstModerna,
                                    DeltaSumSecondModerna: last.SumSecondModerna - penultimate.SumSecondModerna,
                                    DeltaSumThirdModerna: last.SumThirdModerna - penultimate.SumThirdModerna,
                                    DeltaSumBioNTech: last.SumBioNTech - penultimate.SumBioNTech,
                                    DeltaSumAstraZeneca: last.SumAstraZeneca - penultimate.SumAstraZeneca,
                                    DeltaSumModerna: last.SumModerna - penultimate.SumModerna,
                                    DeltaSumJohnsonAndJohnson: last.SumJohnsonAndJohnson - penultimate.SumJohnsonAndJohnson,
                                    DeltaSumThirdJohnsonAndJohnson: last.SumThirdJohnsonAndJohnson - penultimate.SumThirdJohnsonAndJohnson,
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
