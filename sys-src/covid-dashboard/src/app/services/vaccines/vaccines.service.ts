import { Injectable } from '@angular/core';
import { AreaData, ScaleData } from '../alltypes';
import { NetworkService } from '../network/network.service';

@Injectable({
  providedIn: 'root',
})
export class VaccinesService {
  public sumAstraZeneca = [] as ScaleData[];
  public sumBioNTech = [] as ScaleData[];
  public sumJohnsonAndJohnson = [] as ScaleData[];
  public sumModerna = [] as ScaleData[];
  public sumFirstAstraZeneca = [] as ScaleData[];
  public sumFirstBioNTech = [] as ScaleData[];
  public sumFirstModerna = [] as ScaleData[];

  public sumFirstVaccinations = [] as ScaleData[];
  public sumSecondVaccinations = [] as ScaleData[];
  public proportionFirstVaccinations = [] as ScaleData[];
  public proportionSecondVaccinations = [] as ScaleData[];

  public firstSecondVaccinationSum = [] as AreaData[];
  public allVaccinesByManufacturer = [] as ScaleData[];
  public allVaccinesByManTime = [] as AreaData[];

  constructor(private network: NetworkService) {}

  public loadData(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.network.getVaccineSingleState(id).subscribe(
        (res) => {
          for (const element of res) {
            this.sumAstraZeneca.push({
              name: element[0],
              value: element[1].SumAstraZeneca,
            });
            this.sumBioNTech.push({
              name: element[0],
              value: element[1].SumBioNTech,
            });
            this.sumJohnsonAndJohnson.push({
              name: element[0],
              value: element[1].SumJohnsonAndJohnson,
            });
            this.sumModerna.push({
              name: element[0],
              value: element[1].SumModerna,
            });

            this.sumFirstAstraZeneca.push({
              name: element[0],
              value: element[1].SumFirstAstraZeneca,
            });
            this.sumFirstBioNTech.push({
              name: element[0],
              value: element[1].SumFirstBioNTech,
            });
            this.sumFirstModerna.push({
              name: element[0],
              value: element[1].SumFirstModerna,
            });

            this.sumFirstVaccinations.push({
              name: element[0],
              value: element[1].SumFirstVaccinations,
            });
            this.sumSecondVaccinations.push({
              name: element[0],
              value: element[1].SumSecondVaccinations,
            });
            this.proportionFirstVaccinations.push({
              name: element[0],
              value: element[1].ProportionFirstVaccinations,
            });
            this.proportionSecondVaccinations.push({
              name: element[0],
              value: element[1].ProportionSecondVaccinations,
            });
          }
          this.bundleFirstSecondVaccinationSum();
          this.bundleAllVaccinesPercent();
          this.bundleAllVaccinesTime();
          resolve(true);
        },
        (err) => {
          console.log('error', err);
          resolve(false);
        }
      );
    });
  }

  private bundleFirstSecondVaccinationSum() {
    this.firstSecondVaccinationSum = [];
    this.firstSecondVaccinationSum.push({
      name: 'Erstimpfung',
      series: this.sumFirstVaccinations,
    });
    this.firstSecondVaccinationSum.push({
      name: 'Zweitimpfung',
      series: this.sumSecondVaccinations,
    });
  }

  private bundleAllVaccinesPercent() {
    this.allVaccinesByManufacturer = [];
    this.allVaccinesByManufacturer.push({
      name: 'AstraZeneca',
      value: this.sumAstraZeneca[this.sumAstraZeneca.length - 1].value,
    });
    this.allVaccinesByManufacturer.push({
      name: 'BioNTech/Pfizer',
      value: this.sumBioNTech[this.sumBioNTech.length - 1].value,
    });
    this.allVaccinesByManufacturer.push({
      name: 'Johnson and Johnson',
      value:
        this.sumJohnsonAndJohnson[this.sumJohnsonAndJohnson.length - 1].value,
    });
    this.allVaccinesByManufacturer.push({
      name: 'Moderna',
      value: this.sumModerna[this.sumModerna.length - 1].value,
    });
  }

  private bundleAllVaccinesTime() {
    this.allVaccinesByManTime = [];
    this.allVaccinesByManTime.push({
      name: 'AstraZeneca',
      series: this.sumAstraZeneca,
    });
    this.allVaccinesByManTime.push({
      name: 'BioNTech/Pfizer',
      series: this.sumBioNTech,
    });
    this.allVaccinesByManTime.push({
      name: 'Johnson and Johnson',
      series: this.sumJohnsonAndJohnson,
    });
    this.allVaccinesByManTime.push({
      name: 'Moderna',
      series: this.sumModerna,
    });
  }
}
