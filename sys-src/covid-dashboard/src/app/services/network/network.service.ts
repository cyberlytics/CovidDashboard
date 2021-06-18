import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { County, GermanyData, Vaccine } from '../alltypes';
import { map } from 'rxjs/operators';
import { Counties, Vaccines } from '../counties';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private url: string = 'https://covidash.de/api';

  constructor(private http: HttpClient) {}

  public getAllCountyIncidences() {
    return this.http.get<County[]>(this.url + '/incidences/');
  }

  public getSingleCountyIncidences(id: number) {
    return this.http
      .get<County[]>(this.url + '/incidences/' + id)
      .pipe(map((data) => data.map((c) => Counties.formatDate(c))));
  }

  public getCountyOverView() {
    return this.http.get<County[]>(this.url + '/counties');
  }

  public getVaccineSingleState(id: number) {
    return this.http
      .get<Vaccine[]>(this.url + '/vaccines/' + id)
      .pipe(map((data) => data.map((v) => Vaccines.formatDate(v))));
  }

  public getVaccineAllStates() {
    return this.http.get<Vaccine[]>(this.url + '/vaccines');
  }

  public getSummaryGermany() {
    return this.http.get<GermanyData>(this.url + '/summary');
  }
}
