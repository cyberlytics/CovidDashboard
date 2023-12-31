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
  County: string;
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

export type ScaleData = {
  name: string;
  value: number;
};

export enum InfectionChartType {
  incidence7,
  activeCases,
  recovered,
  deaths,
  totalCases,
}

export enum VaccineChartType {
  firstAndSecond,
  percentVaccines,
  timeVaccines,
}

export type AreaData = {
  name: string;
  series: ScaleData[];
};

export type VaccineDiff = {
  0: number;
  1: VaccineDiffDetails;
};

export type VaccineDiffDetails = {
  DeltaProportionFirstVaccinations: number;
  DeltaProportionSecondVaccinations: number;
  DeltaSumAstraZeneca: number;
  DeltaSumBioNTech: number;
  DeltaSumFirstAstraZeneca: number;
  DeltaSumFirstBioNTech: number;
  DeltaSumFirstModerna: number;
  DeltaSumFirstVaccinations: number;
  DeltaSumJohnsonAndJohnson: number;
  DeltaSumModerna: number;
  DeltaSumSecondAstraZeneca: number;
  DeltaSumSecondBioNTech: number;
  DeltaSumSecondModerna: number;
  DeltaSumSecondVaccinations: number;
  DeltaSumVaccinations: number;
};

export type VaccineCombined = {
  Date: string;
  ProportionFirstVaccinations: number;
  ProportionSecondVaccinations: number;
  StateId: number;
  StateName: string;
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
  diff: VaccineDiffDetails;
};

export type CountyCombined = {
  ActiveCases: number;
  County: string;
  CountyId: number;
  Date: string;
  Deaths: number;
  Incidence7: number;
  Population: number;
  Recovered: number;
  StateId: number;
  TotalCases: number;
  diff: CountyDiffDetails;
};

export type CountyDiffDetails = {
  DeltaDeaths: number;
  DeltaIncidence7: number;
  DeltaRecovered: number;
  DeltaTotalCases: number;
};

export interface CountyIDandName {
  0: number;
  1: string;
}

export interface GermanyDataDiff {
  incidence: CountyDiffDetails;
  vaccines: VaccineDiffDetails;
}

export type CountyDiff = {
  0: number;
  1: CountyDiffDetails;
};

export type SelectedBarElement = {
  name: string;
  value: number;
  label: string;
}
