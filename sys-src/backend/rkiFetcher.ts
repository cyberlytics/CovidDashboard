import Papa from "papaparse";
import getFromCache from "./filestore";
import fetch from "node-fetch";

const RKIDataPath = 'https://opendata.arcgis.com/api/v3/datasets/dd4580c810204019a7b8eb3e0b329dd6_0/downloads/data?format=csv&spatialRefId=4326';

export type RKIData = {
    StateId: number;
    CountyId: number;
    TotalCases: number;
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
};

export const CountyNames = new Map<number, string>();
export const StateNames = new Map<number, string>();

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
                    transformHeader: function (s, i) {
                        return {
                            'ObjectId': 'ObjectId',
                            'IdBundesland': 'StateId',
                            'Bundesland': 'State',
                            'IdLandkreis': 'CountyId',
                            'Landkreis': 'County',
                            'Altersgruppe': 'Agegroup',
                            'Geschlecht': 'Sex',
                            'AnzahlFall': 'Cases',
                            'AnzahlTodesfall': 'Deaths',
                            'AnzahlGenesen': 'Recovered',
                            'Meldedatum': 'ReportDate',
                            'NeuerFall': 'NewCaseType',
                            'NeuerTodesfall': 'NewDeathType',
                            'NeuGenesen': 'NewRecoveredType',
                            'Refdatum': 'RefDate',
                            'IstErkrankungsbeginn': 'IsDiseaseBegin',
                            'Datenstand': 'LastUpdate',
                            'Altersgruppe2': 'NotUsed'
                        }[s];
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
                        Date: e.Date,
                        NewCases: newCases,
                        NewDeaths: newDeaths,
                        NewRecovered: newRecovered,
                    });

                    // Fill county and state arrays
                    if (!CountyNames[e.CountyId]) {
                        CountyNames[e.CountyId] = e.County;
                    }
                    if (!StateNames[e.StateId]) {
                        StateNames[e.StateId] = e.State;
                    }
                });

                resolve(result);
            });
        }).then(resolve)
            .catch(reject);
    });
}


export function dataPerCounty(): Promise<Map<number, RKIData>> {
    return new Promise((resolve, reject) => {
        getFromCache('perCounty.json', () => {
            return new Promise((resolve, reject) => {
                fullData()
                    .then(d => {
                        const result = new Map<number, RKIData>();
                        d.forEach(e => {
                            if (!result[e.CountyId]) {
                                result[e.CountyId] = {
                                    CountyId: e.CountyId,
                                    StateId: e.StateId,
                                    TotalCases: 0,
                                };
                            }
                            result[e.CountyId].TotalCases += e.NewCases + e.NewDeaths + e.NewRecovered;
                        });
                        resolve(JSON.stringify(result));
                    })
                    .catch(reject);
            });
        }, (t) => {
            return new Promise((resolve, reject) => {
                resolve(JSON.parse(t));
            });
        })
            .then(resolve)
            .catch(reject);
    });
}