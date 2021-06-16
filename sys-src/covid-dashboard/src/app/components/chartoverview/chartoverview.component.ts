import { Component, OnInit } from '@angular/core';
import { ChartType } from '../barchart/barchart.component';

@Component({
  selector: 'app-chartoverview',
  templateUrl: './chartoverview.component.html',
  styleUrls: ['./chartoverview.component.scss']
})
export class ChartoverviewComponent implements OnInit {

  public type: ChartType = ChartType.incidence7;
  public chartDays: number[] = [7, 14, 21, 28, 35, 42, 49, 56];
  public daynumber: number = 7;
  constructor() { }

  ngOnInit(): void {
  }

  public changeType(typ: 'incidence7' | 'activeCases' | 'recovered' | 'deaths' | 'totalCases' ): void {
    if (typ === 'incidence7') {
      this.type = ChartType.incidence7;
    } else if (typ === 'activeCases') {
      this.type = ChartType.activeCases;
    } else if (typ === 'recovered') {
      this.type = ChartType.recovered;
    } else if (typ === 'deaths') {
      this.type = ChartType.deaths;
    } else if (typ === 'totalCases') {
      this.type = ChartType.totalCases;
    }
  }

}
