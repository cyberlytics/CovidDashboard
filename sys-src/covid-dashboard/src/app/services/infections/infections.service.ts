import { Injectable } from '@angular/core';
import { ChartType, ScaleData } from 'src/app/components/barchart/barchart.component';
import { NetworkService } from '../network/network.service';

@Injectable({
  providedIn: 'root'
})
export class InfectionsService {

  // arrays
  public incidences = [] as ScaleData[];
  public activeCases = [] as ScaleData[];
  public recovered = [] as ScaleData[];
  public deaths = [] as ScaleData[];
  public totalCases = [] as ScaleData[];
  public recoveredDeathsTotalCases = [] as AreaData[];

  public loaded: boolean = false;

  constructor(
    private network: NetworkService
  ) { }

  /**
   * loads the data and sorts it
   */
  public loadData(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.incidences = [];
      this.activeCases = [];
      this.recovered = [];
      this.deaths = [];
      this.totalCases = [];
      this.network.getSingleCountyIncidences(id).subscribe((res) => {
        // console.log('res singel chart', res);
        for (const element of res) {
          this.incidences.push({name: element[0], value: element[1].Incidence7});
          this.activeCases.push({name: element[0], value: element[1].ActiveCases});
          this.recovered.push({name: element[0], value: element[1].Recovered});
          this.deaths.push({name: element[0], value: element[1].Deaths});
          this.totalCases.push({name: element[0], value: element[1].TotalCases});
        }
        this.mapScaleDataToAreaData();
        resolve(true);
      }, (err) => {
        console.log('error getSingelCoutnyIncidences', err);
        resolve(false);
      });
    });
  }

  private mapScaleDataToAreaData(): void {
    this.recoveredDeathsTotalCases.push({name: 'Gestorbene', series: this.deaths});
    this.recoveredDeathsTotalCases.push({name: 'Genesene', series: this.recovered});
    this.recoveredDeathsTotalCases.push({name: 'Gesamte Fälle', series: this.totalCases});
  }

}


export type AreaData = {
  name: string;
  series: ScaleData[];
};
