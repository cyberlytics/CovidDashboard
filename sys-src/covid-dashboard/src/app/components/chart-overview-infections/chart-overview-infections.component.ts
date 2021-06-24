import { Component, OnInit } from '@angular/core';
import { AreaData, InfectionChartType } from '../../services/alltypes';
import { InfectionsService } from '../../services/infections/infections.service';

@Component({
  selector: 'app-chart-overview-infections',
  templateUrl: './chart-overview-infections.component.html',
  styleUrls: ['./chart-overview-infections.component.scss'],
})
export class ChartOverviewInfectionsComponent implements OnInit {
  public type: InfectionChartType = InfectionChartType.incidence7;
  public timeSpan: [string, number][] = [
    ['1 Woche', 7],
    ['2 Wochen', 14],
    ['3 Wochen', 21],
    ['1 Monat', 30],
    ['3 Monate', 90],
    ['6 Monate', 180],
    ['1 Jahr', 365],
    ['Gesamter Zeitraum', 400],
  ];
  public dayNumber: number = 7;
  public loaded: boolean = false;
  public recDeaTotalCases: AreaData[] = [];
  public showRecDeadTotal: boolean = false;
  public colorScheme = {};

  readonly chartType = InfectionChartType;
  readonly incidence7ColorScheme = {
    domain: ['#a81dff'],
  };
  readonly activeCasesColorScheme = {
    domain: ['#529bf2'],
  };
  readonly recoveredColorScheme = {
    domain: ['#62d87b'],
  };
  readonly deathsColorScheme = {
    domain: ['#cbd5de'],
  };
  readonly totalCasesColorScheme = {
    domain: ['#ff1f4d'],
  };
  readonly recDeaTotalCasesColorScheme = {
    domain: ['#9e9688', '#62d87b', '#ffc71d'],
  };

  constructor(private infections: InfectionsService) {
    // calculate days for all time span
    const date = new Date();
    date.setHours(1, 0, 0);
    const startDate = new Date('2020-03-14');
    startDate.setHours(0, 0, 0);
    let diff = date.getTime() - startDate.getTime();
    diff = Math.round(diff / (1000 * 3600 * 24));
    this.timeSpan[this.timeSpan.length - 1][1] = diff;

    this.infections.getSelectedCountyInfo().subscribe((id) => {
      console.log('id', id);
      this.infections.loadData(id);
    })
  }

  ngOnInit(): void {
    this.loadData(0);

    this.colorScheme = this.incidence7ColorScheme;
  }

  /**
   * changes the type and color scheme of the chart
   * @param typ of the chart
   */
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
      this.colorScheme = this.incidence7ColorScheme;
    } else if (typ === 'activeCases') {
      this.type = InfectionChartType.activeCases;
      this.colorScheme = this.activeCasesColorScheme;
    } else if (typ === 'recovered') {
      this.type = InfectionChartType.recovered;
      this.colorScheme = this.recoveredColorScheme;
    } else if (typ === 'deaths') {
      this.type = InfectionChartType.deaths;
      this.colorScheme = this.deathsColorScheme;
    } else if (typ === 'totalCases') {
      this.type = InfectionChartType.totalCases;
      this.colorScheme = this.totalCasesColorScheme;
    } else if (typ === 'recDeadTotal') {
      this.showRecDeadTotal = true;
      this.colorScheme = this.recDeaTotalCasesColorScheme;
    }
  }

  private loadData(id: number) {
    this.infections.loadData(id).then((bool) => {
      this.loaded = bool;
      this.recDeaTotalCases = this.infections.recoveredDeathsTotalCases;
    });
  }
}
