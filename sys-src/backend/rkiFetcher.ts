import Papa from "papaparse";
import getFromCache from "./filestore";
import fetch from "node-fetch";
import { parse, stringify } from "./util";

const RKIDataPath = 'https://opendata.arcgis.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads/data?format=csv&spatialRefId=4326';

export type RKIData = {
    StateId: number,
    CountyId: number,
    TotalCases: number,
    Recovered: number,
    Deaths: number,
    ActiveCases: number,
    Incidence7: number,
};

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
                        Date: e.IsDiseaseBegin === 1 ? e.RefDate : e.Date,
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


export function dataPerCounty(): Promise<Map<number, RKIData>> {
    return new Promise((resolve, reject) => {
        getFromCache<Map<number, RKIData>>('perCounty.json', () => {
            return new Promise((resolve, reject) => {
                fullData()
                    .then(d => {
                        const result = new Map<number, RKIData>();
                        d.forEach(e => {
                            if (!result.has(e.CountyId)) {
                                result.set(e.CountyId, {
                                    CountyId: e.CountyId,
                                    StateId: e.StateId,
                                    TotalCases: 0,
                                    Recovered: 0,
                                    Deaths: 0,
                                    ActiveCases: 0,
                                    Incidence7: 0,
                                });
                            }
                            result.get(e.CountyId)!.TotalCases += e.NewCases + e.NewDeaths + e.NewRecovered;
                            result.get(e.CountyId)!.Deaths += e.NewDeaths;
                            result.get(e.CountyId)!.Recovered += e.NewRecovered;
                        });
                        result.forEach(r => {
                            r.ActiveCases = r.TotalCases - r.Deaths - r.Recovered;

                        });

                        resolve(stringify(result));
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

                        resolve(stringify({ counties, states }));
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