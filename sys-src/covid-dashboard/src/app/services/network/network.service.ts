import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { County, Vaccine, VaccineData } from '../county';
import { map } from 'rxjs/operators';
import { Counties, Vaccines } from '../counties';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private url: string = 'http://localhost:5000';

  constructor(
    private http: HttpClient
  ) { }

  public getCounty(id: number) {
    return this.http.get<County[]>(this.url + '/county/' + id).pipe(map((data) =>
    data.map(c => Counties.formatDate(c))));
  }

  public getVaccine(id: number) {
    return this.http.get<Vaccine[]>(this.url + '/vaccine/' + id).pipe(map((data) =>
    data.map(v => Vaccines.formatDate(v))));
  }
}
