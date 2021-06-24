import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AreaData, CountyIDandName, ScaleData } from '../alltypes';
import { NetworkService } from '../network/network.service';

@Injectable({
  providedIn: 'root',
})
export class InfectionsService {
  // arrays for the charts
  public incidences = [] as ScaleData[];
  public activeCases = [] as ScaleData[];
  public recovered = [] as ScaleData[];
  public deaths = [] as ScaleData[];
  public totalCases = [] as ScaleData[];

  // comibend array with multiple data types
  public recoveredDeathsTotalCases = [] as AreaData[];

  public selectedCountyId: number = 0;
  public selectedCountyName: string = 'Deutschland';
  private selectedCountyChanged: Subject<number>;
  private newDataLoadedSubject: Subject<void>;

  public countyIDandNameList: CountyIDandName[] = [];

  constructor(private network: NetworkService) {
    this.selectedCountyChanged = new Subject<number>();
    this.newDataLoadedSubject = new Subject<void>();
    this.saveCountyIDandName();
  }

  /**
   * loads the data for a specific county and saves the data filtered by type
   * @param id id of the county
   * @returns if data was saved correctly
   */
  public loadData(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.incidences = [];
      this.activeCases = [];
      this.recovered = [];
      this.deaths = [];
      this.totalCases = [];
      this.network.getSingleCountyIncidences(id).subscribe(
        (res) => {
          for (const element of res) {
            this.incidences.push({
              name: element[0],
              value: element[1].Incidence7,
            });
            this.activeCases.push({
              name: element[0],
              value: element[1].ActiveCases,
            });
            this.recovered.push({
              name: element[0],
              value: element[1].Recovered,
            });
            this.deaths.push({ name: element[0], value: element[1].Deaths });
            this.totalCases.push({
              name: element[0],
              value: element[1].TotalCases,
            });
          }
          this.mapScaleDataToAreaData();
          this.newDataLoadedSubject.next();
          resolve(true);
        },
        (err) => {
          console.log('error getSingleCountyIncidences', err);
          resolve(false);
        }
      );
    });
  }

  /**
   * groups data to array
   */
  private mapScaleDataToAreaData(): void {
    this.recoveredDeathsTotalCases = [];
    this.recoveredDeathsTotalCases.push({
      name: 'Gestorbene',
      series: this.deaths,
    });
    this.recoveredDeathsTotalCases.push({
      name: 'Genesene',
      series: this.recovered,
    });
    this.recoveredDeathsTotalCases.push({
      name: 'Gesamte Fälle',
      series: this.totalCases,
    });
  }

  public setSelectedCountyId(id: number) {
    this.selectedCountyId = id;
    this.selectedCountyChanged.next(id);
  }

  public getSelectedCountyInfo() {
    return this.selectedCountyChanged.asObservable();
  }

  public newDataLoaded() {
    return this.newDataLoadedSubject.asObservable();
  }

  private saveCountyIDandName() {
    this.network.getCountyOverview().subscribe((res) => {
      this.countyIDandNameList = res;
    });
  }

  public getCountyNameFromId(id: number): string {
    let temp;
    if (id === 0) {
      temp = 'Deutschland';
    } else {
      temp = this.countyIDandNameList.find((item) => item[0] === id)?.[1];
    }
    if (temp) {
      return temp;
    }
    return '';
  }
}
