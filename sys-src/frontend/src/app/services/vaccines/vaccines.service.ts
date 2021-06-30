/* eslint-disable @typescript-eslint/consistent-type-imports */
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {NetworkService} from '../network/network.service';
import {AreaData, ScaleData} from "../alltypes";

@Injectable({
  providedIn: 'root'
})
export class VaccinesService {
// arrays for the charts
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

  // combined arrays for the charts
  public firstSecondVaccinationSum = [] as AreaData[];
  public allVaccinesByManufacturer = [] as ScaleData[];
  public allVaccinesByManTime = [] as AreaData[];

  public selectedStateId = 0;
  public statesMap = [
    {
      id: 0,
      name: 'Deutschland',
    },
    {
      id: 1,
      name: 'Schleswig-Holstein',
    },
    {
      id: 2,
      name: 'Hamburg',
    },
    {
      id: 3,
      name: 'Niedersachsen',
    },
    {
      id: 4,
      name: 'Bremen',
    },
    {
      id: 5,
      name: 'Nordrhein-Westfalen',
    },
    {
      id: 6,
      name: 'Hessen',
    },
    {
      id: 7,
      name: 'Rheinland-Pfalz',
    },
    {
      id: 8,
      name: 'Baden-Württemberg',
    },
    {
      id: 9,
      name: 'Bayern',
    },
    {
      id: 10,
      name: 'Saarland',
    },
    {
      id: 11,
      name: 'Berlin',
    },
    {
      id: 12,
      name: 'Brandenburg',
    },
    {
      id: 13,
      name: 'Mecklenburg-Vorpommern',
    },
    {
      id: 14,
      name: 'Sachsen',
    },
    {
      id: 15,
      name: 'Sachsen-Anhalt',
    },
    {
      id: 16,
      name: 'Thüringen',
    },
  ];
  private selectedStateChanged: Subject<number>;
  private newDataLoadedSubject: Subject<void>;

  constructor(private network: NetworkService) {
    this.selectedStateChanged = new Subject<number>();
    this.newDataLoadedSubject = new Subject<void>();
  }

  /**
   * loads the data for a specific state and saves it to the specific arrays
   * @param id of the state
   * @returns if data was saved correctly
   */
  public loadData(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.sumAstraZeneca = [];
      this.sumBioNTech = [];
      this.sumJohnsonAndJohnson = [];
      this.sumModerna = [];
      this.sumFirstAstraZeneca = [];
      this.sumFirstBioNTech = [];
      this.sumFirstModerna = [];

      this.sumFirstVaccinations = [];
      this.sumSecondVaccinations = [];
      this.proportionFirstVaccinations = [];
      this.proportionSecondVaccinations = [];
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
          this.newDataLoadedSubject.next();
          resolve(true);
        },
        (err) => {
          console.log('error', err);
          resolve(false);
        }
      );
    });
  }

  /**
   * set selected state id
   * @param id of the state
   */
  public setSelectedStateId(id: number): void {
    this.selectedStateId = id;
    this.selectedStateChanged.next(id);
  }

  /**
   * get notified if selected state changed
   * @returns id of the state
   */
  public getSelectedStateInfo(): Observable<number> {
    return this.selectedStateChanged.asObservable();
  }

  /**
   * get notified when new data loaded
   * @returns void
   */
  public newDataLoaded(): Observable<void> {
    return this.newDataLoadedSubject.asObservable();
  }

  /**
   * get the name of a specific state
   * @param id of the state
   * @returns name of the state
   */
  public getStateNameFromId(id: number): string {
    const temp = this.statesMap.find((item) => item.id === id)?.name;
    if (temp) {
      return temp;
    }
    return '';
  }

  /**
   * bundles the first and second vaccination array
   */
  private bundleFirstSecondVaccinationSum(): void {
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

  /**
   * bundles the vaccines from the different manufactors for the last day
   */
  private bundleAllVaccinesPercent(): void {
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

  /**
   * bundles all manufactors by time
   */
  private bundleAllVaccinesTime(): void {
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
