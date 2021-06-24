import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  County,
  CountyIDandName,
  GermanyData,
  Vaccine,
  VaccineDiff,
} from '../alltypes';
import { map } from 'rxjs/operators';
import { Counties, Vaccines } from '../counties';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private url: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * gets the latest infection data for all countyíes
   * @returns county array
   */
  public getAllCountyIncidences() {
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
  public getCountyOverview() {
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
   * @returns
   */
  public getVaccineAllStates() {
    return this.http.get<Vaccine[]>(this.url + '/vaccines');
  }

  /**
   * gets a summary of germany with the latest vaccine and infection data
   * @returns
   */
  public getSummaryGermany() {
    return this.http.get<GermanyData>(this.url + '/summary');
  }

  public getStatesWithDiff() {
    return this.http.get<VaccineDiff[]>(this.url + '/vaccines/diff');
  }

  public getCountyDiff() {
    return this.http.get<Array<any>>(this.url + '/incidences/diff');
  }
}
