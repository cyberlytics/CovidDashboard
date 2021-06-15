import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit, OnChanges {

  @Input() type: ChartType = ChartType.incidence7;
  @Input() daynumber: number = 7;

  public displayedValues = [] as ScaleData[];
  public loaded: boolean = false;

  // arrays
  public incidences = [] as ScaleData[];
  public activeCases = [] as ScaleData[];
  public recovered = [] as ScaleData[];
  public deaths = [] as ScaleData[];
  public totalCases = [] as ScaleData[];

  colorScheme = {
    domain: ['#ff1f4d']
  };

  constructor(
    private network: NetworkService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.changedInput(this.type, this.daynumber);
  }

  /**
   * loads the data and sorts it
   */
  private loadData(): void {
    this.incidences = [];
    this.activeCases = [];
    this.recovered = [];
    this.deaths = [];
    this.totalCases = [];
    this.network.getSingleCountyIncidences(9361).subscribe((res) => {
      console.log('res singel chart', res);
      for (const element of res) {
        this.incidences.push({name: element[0], value: element[1].Incidence7});
        this.activeCases.push({name: element[0], value: element[1].ActiveCases});
        this.recovered.push({name: element[0], value: element[1].Recovered});
        this.deaths.push({name: element[0], value: element[1].Deaths});
        this.totalCases.push({name: element[0], value: element[1].TotalCases});
      }

      this.loaded = true;
      this.changedInput(ChartType.incidence7, this.daynumber);
    }, (err) => {
      console.log('error getSingelCoutnyIncidences', err);
    });
  }

  /**
   * changes the displayed values
   * @param typ selected type
   * @param count selected
   */
  private changedInput(typ: ChartType, count: number): void {
    if (typ === ChartType.incidence7) {
      this.displayedValues = this.incidences.slice();
    } else if (typ === ChartType.activeCases) {
      this.displayedValues = this.activeCases.slice();
    } else if (typ === ChartType.recovered) {
      this.displayedValues = this.recovered.slice();
    } else if (typ === ChartType.deaths) {
      this.displayedValues = this.deaths.slice();
    } else if (typ === ChartType.totalCases) {
      this.displayedValues = this.totalCases.slice();
    }

    if (count <= this.displayedValues.length){
      this.displayedValues = this.displayedValues.splice(this.displayedValues.length - count, this.displayedValues.length);
    }
  }

}

export type ScaleData = {
  name: string;
  value: number;
};

export enum ChartType{
  incidence7,
  activeCases,
  recovered,
  deaths,
  totalCases
};
