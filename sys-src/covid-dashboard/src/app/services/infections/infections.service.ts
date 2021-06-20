import { Injectable } from '@angular/core';
import { AreaData, ScaleData } from '../alltypes';
import { NetworkService } from '../network/network.service';

@Injectable({
  providedIn: 'root',
})
export class InfectionsService {
  public incidences = [] as ScaleData[];
  public activeCases = [] as ScaleData[];
  public recovered = [] as ScaleData[];
  public deaths = [] as ScaleData[];
  public totalCases = [] as ScaleData[];
  public recoveredDeathsTotalCases = [] as AreaData[];

  constructor(private network: NetworkService) {}

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
          resolve(true);
        },
        (err) => {
          console.log('error getSingleCountyIncidences', err);
          resolve(false);
        }
      );
    });
  }

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
}
