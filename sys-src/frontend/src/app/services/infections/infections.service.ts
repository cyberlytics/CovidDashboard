/* eslint-disable @typescript-eslint/consistent-type-imports */
import {Injectable} from '@angular/core';
import {AreaData, CountyIDandName, ScaleData} from "../alltypes";
import {Observable, Subject} from "rxjs";
import {NetworkService} from "../network/network.service";

@Injectable({
  providedIn: 'root'
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

  public selectedCountyId = 0;
  public selectedCountyName = 'Deutschland';
  public countyIDandNameList: CountyIDandName[] = [];
  private selectedCountyChanged: Subject<number>;
  private newDataLoadedSubject: Subject<void>;

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
    return new Promise<boolean>((resolve) => {
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
            this.deaths.push({name: element[0], value: element[1].Deaths});
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
   * sets the selected county id
   * @param id id of the county
   */
  public setSelectedCountyId(id: number): void {
    this.selectedCountyId = id;
    this.selectedCountyChanged.next(id);
  }

  /**
   * notifies if the selected county has changed
   * @returns id of the county
   */
  public getSelectedCountyInfo(): Observable<number> {
    return this.selectedCountyChanged.asObservable();
  }

  /**
   * notifies when new data loaded
   * @returns void
   */
  public newDataLoaded(): Observable<void> {
    return this.newDataLoadedSubject.asObservable();
  }

  /**
   * get the name for a specific state
   * @param id id of the state
   * @returns name of the state
   */
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

  /**
   * saves all state ids and names in list
   */
  private saveCountyIDandName(): void {
    this.network.getCountyOverview().subscribe((res) => {
      this.countyIDandNameList = res;
    });
  }
}
