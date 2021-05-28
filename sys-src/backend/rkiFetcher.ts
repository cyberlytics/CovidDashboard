import Papa from "papaparse";
import getFromCache from "./filestore";
import fetch from "node-fetch";
import { addDays, lastDays, parse, parseRKIDate, stringify } from "./util";

const RKIDataPath = 'https://opendata.arcgis.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads/data?format=csv&spatialRefId=4326';
const RKIPopulationDataPath = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=EWZ,last_update,cases7_per_100k,AdmUnitId,cases7_lk,death7_lk&returnGeometry=false&outSR=4326&f=json';

export type RKIData = {
    StateId: number,
    CountyId: number,
    TotalCases: number,
    Recovered: number,
    Deaths: number,
    ActiveCases: number,
    Incidence7: number,
    Population: number,
};

type RKIPopulationData = {
    CountyId: number,
    Population: number,
    Cases7: number,
    Incidence7: number,
    LastUpdate: number,
    Deaths7: number,
}

export type RKIRawData = {
    StateId: number;
    CountyId: number;
    Agegroup: '00-04' | '05-14' | '15-34' | '35-59' | '60-79' | '80+' | 'unknown';
    Sex: 'm' | 'f' | 'u';
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

function convertAgegroup(rkiAgeGroup: string): RKIRawData["Agegroup"] {
    switch (rkiAgeGroup) {
        case 'A00-A04': return '00-04';
        case 'A05-A14': return '05-14';
        case 'A15-A34': return '15-34';
        case 'A35-A59': return '35-59';
        case 'A60-A79': return '60-79';
        case 'A80+': return '80+';
    }
    return 'unknown';
}

function convertSex(rkiSex: string): RKIRawData["Sex"] {
    switch (rkiSex) {
        case 'M': return 'm';
        case 'W': return 'f';
    }
    return 'u';
}

const headerTranslation = (function () {
    const map = new Map<string, string>();
    map.set('ObjectId', 'ObjectId');
    map.set('IdBundesland', 'StateId');
    map.set('Bundesland', 'State');
    map.set('IdLandkreis', 'CountyId');
    map.set('Landkreis', 'County');
    map.set('Altersgruppe', 'Agegroup');
    map.set('Geschlecht', 'Sex');
    map.set('AnzahlFall', 'Cases');
    map.set('AnzahlTodesfall', 'Deaths');
    map.set('AnzahlGenesen', 'Recovered');
    map.set('Meldedatum', 'ReportDate');
    map.set('NeuerFall', 'NewCaseType');
    map.set('NeuerTodesfall', 'NewDeathType');
    map.set('NeuGenesen', 'NewRecoveredType');
    map.set('Refdatum', 'RefDate');
    map.set('IstErkrankungsbeginn', 'IsDiseaseBegin');
    map.set('Datenstand', 'LastUpdate');
    map.set('Altersgruppe2', 'NotUsed');
    return map;
})(); // IIFE


function fullData(): Promise<RKIRawData[]> {
    return new Promise((resolve, reject) => {
        getFromCache<RKIRawData[]>('fullData.csv', () => {
            return new Promise((resolve, reject) => {
                fetch(RKIDataPath)
                    .then(d => {
                        d.text()
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            });
        }, (t) => {
            return new Promise<any>((resolve, reject) => {
                const parseResult = Papa.parse(t, {
                    header: true,
                    transformHeader: function (s: string) {
                        return headerTranslation.get(s)!;
                    },
                    dynamicTyping: true,
                    skipEmptyLines: 'greedy',
                });
                if (parseResult.errors && parseResult.errors.length > 0) {
                    reject(parseResult.errors);
                }

                const result = new Array<RKIRawData>();
                parseResult.data.forEach((e: any) => {
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
                        Date: //parseRKIDate(e.IsDiseaseBegin === 1 ? e.RefDate : e.ReportDate),
                                parseRKIDate(e.ReportDate),
                        NewCases: newCases,
                        NewDeaths: newDeaths,
                        NewRecovered: newRecovered,
                        County: e.County,
                        State: e.State,
                    });
                });

                resolve(result);
            });
        }).then(resolve)
            .catch(reject);
    });
}


export function dataPerCounty(): Promise<Map<number, Map<number, RKIData>>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, Map<number, RKIData>>>('perCounty.json', () => {
            return new Promise((resolve, reject) => {
                getFromCache<Map<number, RKIPopulationData>>('population.json', () => {
                    return new Promise((resolve, reject) => {
                        fetch(RKIPopulationDataPath)
                            .then(d => {
                                d.json()
                                    .then(j => {
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
                                    .catch(reject)
                            })
                            .catch(reject);
                    });
                }, (t) => {
                    return new Promise<Map<number, RKIPopulationData>>((resolve, reject) => {
                        resolve(parse(t));
                    });
                }).then((p) => {
                    fullData()
                        .then(d => {
                            const groupPerCounty = new Map<number, RKIRawData[]>();
                            d.forEach(e => {
                                if (!groupPerCounty.has(e.CountyId)) {
                                    groupPerCounty.set(e.CountyId, []);
                                }
                                groupPerCounty.get(e.CountyId)!.push(e);
                            });

                            const result = new Map<number, Map<number, RKIData>>();
                            groupPerCounty.forEach((v, k) => {
                                const daysMap = new Map<number, RKIData>();
                                lastDays(20).forEach(day => {
                                    const dayValue = day.valueOf();
                                    v.forEach(e => {
                                        if (e.Date <= day) {
                                            if (!daysMap.has(dayValue)) {
                                                daysMap.set(dayValue, {
                                                    CountyId: k,
                                                    StateId: e.StateId,
                                                    TotalCases: 0,
                                                    Recovered: 0,
                                                    Deaths: 0,
                                                    ActiveCases: 0,
                                                    Incidence7: -1,
                                                    Population: 0,
                                                });
                                            }
                                            daysMap.get(dayValue)!.TotalCases += e.NewCases + e.NewDeaths + e.NewRecovered;
                                            daysMap.get(dayValue)!.Deaths += e.NewDeaths;
                                            daysMap.get(dayValue)!.Recovered += e.NewRecovered;
                                        }
                                    });
                                });
                                daysMap.forEach((r, d) => {
                                    r.ActiveCases = r.TotalCases - r.Deaths - r.Recovered;
                                    r.Population = p.get(r.CountyId)?.Population ?? 1;
                                    const dateMinus7 = addDays(new Date(d), -7).valueOf();
                                    if (daysMap.has(dateMinus7)) {
                                        r.Incidence7 = (r.TotalCases - daysMap.get(dateMinus7)!.TotalCases) / r.Population * 100_000;
                                    }
                                });
                                result.set(k, daysMap);
                            });
                            resolve(stringify(result));
                        })
                        .catch(reject);
                })
                    .catch(reject);
            });
        }, (t) => {
            return new Promise((resolve, reject) => {
                resolve(parse(t));
            });
        })
            .then(resolve)
            .catch(reject);
    });
}

export function getNames(): Promise<Names> {
    return new Promise((resolve, reject) => {
        getFromCache<Names>('names.json', () => {
            return new Promise((resolve, reject) => {
                fullData()
                    .then(d => {
                        const counties = new Map<number, string>();
                        const states = new Map<number, string>();

                        d.forEach(v => {
                            if (!counties.has(v.CountyId)) {
                                counties.set(v.CountyId, v.County);
                            }
                            if (!states.has(v.StateId)) {
                                states.set(v.StateId, v.State);
                            }
                        })

                        resolve(stringify({ Counties: counties, States: states }));
                    })
                    .catch(reject);
            });
        }, (t) => {
            return new Promise((resolve, reject) => {
                resolve(parse(t));
            });
        })
            .then(resolve)
            .catch(reject);
    });
}