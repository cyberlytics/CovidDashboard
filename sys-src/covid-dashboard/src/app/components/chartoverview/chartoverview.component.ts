import { Component, OnInit } from '@angular/core';
import { AreaData, InfectionChartType } from 'src/app/services/alltypes';
import { InfectionsService } from 'src/app/services/infections/infections.service';


@Component({
  selector: 'app-chartoverview',
  templateUrl: './chartoverview.component.html',
  styleUrls: ['./chartoverview.component.scss'],
})
export class ChartoverviewComponent implements OnInit {
  public type: InfectionChartType = InfectionChartType.incidence7;
  readonly chartType = InfectionChartType;
  public timeSpan: [string, number][] = [
    ['1 Woche', 7],
    ['2 Wochen', 14],
    ['3 Wochen', 21],
    ['1 Monat', 30],
    ['3 Monate', 90],
    ['6 Monate', 180],
    ['1 Jahr', 365],
    ['gesamter Zeitraum', 400],
  ];
  public dayNumber: number = 7;
  public loaded: boolean = false;
  public recDeaTotalCases: AreaData[] = [];
  public showRecDeadTotal: boolean = false;

  constructor(private infections: InfectionsService) {
    // calculate days for all time span
    const date = new Date();
    date.setHours(1, 0, 0);
    const startDate = new Date('2020-03-14');
    startDate.setHours(0, 0, 0);
    let diff = date.getTime() - startDate.getTime();
    diff = Math.round(diff / (1000 * 3600 * 24));
    this.timeSpan[this.timeSpan.length - 1][1] = diff;
  }

  ngOnInit(): void {
    this.infections.loadData(9361).then((bool) => {
      this.loaded = bool;
      this.recDeaTotalCases = this.infections.recoveredDeathsTotalCases;
    });
  }

  public changeType(
    typ:
      | 'incidence7'
      | 'activeCases'
      | 'recovered'
      | 'deaths'
      | 'totalCases'
      | 'recDeadTotal'
  ): void {
    this.showRecDeadTotal = false;
    if (typ === 'incidence7') {
      this.type = InfectionChartType.incidence7;
    } else if (typ === 'activeCases') {
      this.type = InfectionChartType.activeCases;
    } else if (typ === 'recovered') {
      this.type = InfectionChartType.recovered;
    } else if (typ === 'deaths') {
      this.type = InfectionChartType.deaths;
    } else if (typ === 'totalCases') {
      this.type = InfectionChartType.totalCases;
    } else if (typ === 'recDeadTotal') {
      this.showRecDeadTotal = true;
    }
  }
}
