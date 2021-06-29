import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {County, CountyDiff, CountyIDandName, GermanyData, GermanyDataDiff, Vaccine, VaccineDiff,} from '../alltypes';
import {map} from 'rxjs/operators';
import {Counties, Vaccines} from '../counties';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private url: string = 'https://covidash.de/api';

  constructor(private http: HttpClient) {
  }

  /**
   * gets the latest infection data for all countyíes
   * @returns county array
   */
  public getAllCountyIncidences(): Observable<County[]> {
    return this.http.get<County[]>(this.url + '/incidences/');
  }

  /**
   * gets all infection data from the first day till today from a specific county
   * @param id of the county
   * @returns county array
   */
  public getSingleCountyIncidences(id: number) {
    return this.http
      .get<County[]>(this.url + '/incidences/' + id)
      .pipe(map((data) => data.map((c) => Counties.formatDate(c))));
  }

  /**
   * get infection overview over the counties
   * @returns county array
   */
  public getCountyOverview(): Observable<CountyIDandName[]> {
    return this.http.get<CountyIDandName[]>(this.url + '/counties');
  }

  /**
   * gets all infection data from the first day till today from a specific state
   * @param id of the state
   * @returns vaccine array
   */
  public getVaccineSingleState(id: number) {
    return this.http
      .get<Vaccine[]>(this.url + '/vaccines/' + id)
      .pipe(map((data) => data.map((v) => Vaccines.formatDate(v))));
  }

  /**
   * get the latest vaccine data for all states
   * @returns vaccine array
   */
  public getVaccineAllStates(): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(this.url + '/vaccines');
  }

  /**
   * gets a summary of germany with the latest vaccine and infection data
   * @returns germanydata
   */
  public getSummaryGermany(): Observable<GermanyData> {
    return this.http.get<GermanyData>(this.url + '/summary');
  }

  /**
   * get alle state diffs to day before
   * @returns vacinediff array
   */
  public getStatesWithDiff(): Observable<VaccineDiff[]> {
    return this.http.get<VaccineDiff[]>(this.url + '/vaccines/diff');
  }

  /**
   * get all county diffs to day before
   * @returns countydiff array
   */
  public getCountyDiff(): Observable<CountyDiff[]> {
    return this.http.get<CountyDiff[]>(this.url + '/incidences/diff');
  }

  /**
   * get germany diff to day before
   * @returns germanydatadiff
   */
  public getSummaryDiff(): Observable<GermanyDataDiff> {
    return this.http.get<GermanyDataDiff>(this.url + '/summary/diff');
  }
}
