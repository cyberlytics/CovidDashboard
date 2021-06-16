import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InfectionsService } from 'src/app/services/infections/infections.service';
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
  @Input() loaded: boolean = false;


  colorScheme = {
    domain: ['#ff1f4d']
  };

  constructor(
    private network: NetworkService,
    private infections: InfectionsService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.changedInput(this.type, this.daynumber);
  }



  /**
   * changes the displayed values
   * @param typ selected type
   * @param count selected
   */
  private changedInput(typ: ChartType, count: number): void {
    if (typ === ChartType.incidence7) {
      this.displayedValues = this.infections.incidences.slice();
    } else if (typ === ChartType.activeCases) {
      this.displayedValues = this.infections.activeCases.slice();
    } else if (typ === ChartType.recovered) {
      this.displayedValues = this.infections.recovered.slice();
    } else if (typ === ChartType.deaths) {
      this.displayedValues = this.infections.deaths.slice();
    } else if (typ === ChartType.totalCases) {
      this.displayedValues = this.infections.totalCases.slice();
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
}
