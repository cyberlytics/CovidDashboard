export interface County {
  0: Date;
  1: CountyData;
}

export type CountyData = {
  ActiveCases: number;
  CountyId: number;
  Date: string;
  Deaths: number;
  Incidence7: number;
  Population: number;
  Recovered: number;
  State: string;
  StateId: number;
  TotalCases: number;
};

export interface Vaccine {
  0: number;
  1: VaccineData;
}

export type VaccineData = {
  Date: string;
  ProportionFirstVaccinations: number;
  ProportionSecondVaccinations: number;
  StateId: number;
  SumAstraZeneca: number;
  SumBioNTech: number;
  SumFirstAstraZeneca: number;
  SumFirstBioNTech: number;
  SumFirstModerna: number;
  SumFirstVaccinations: number;
  SumJohnsonAndJohnson: number;
  SumModerna: number;
  SumSecondAstraZeneca: number;
  SumSecondBioNTech: number;
  SumSecondModerna: number;
  SumSecondVaccinations: number;
  SumVaccinations: number;
};

export interface GermanyData {
  incidence: CountyData;
  vaccines: VaccineData;
}
