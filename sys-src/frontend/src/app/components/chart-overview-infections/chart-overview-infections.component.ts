import type {OnDestroy, OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ResizeService } from 'src/app/services/resize/resize.service';
import type {AreaData} from '../../services/alltypes';
import {InfectionChartType} from '../../services/alltypes';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {InfectionsService} from '../../services/infections/infections.service';

@Component({
  selector: 'app-chart-overview-infections',
  templateUrl: './chart-overview-infections.component.html',
  styleUrls: ['./chart-overview-infections.component.scss'],
})
export class ChartOverviewInfectionsComponent implements OnInit, OnDestroy {
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
  public timeSpanMobile: [string, number][] = [
    ['1W', 7],
    ['2W', 14],
    ['3W', 21],
    ['1M', 30],
    ['3M', 90],
    ['6M', 180],
    ['1J', 365],
    ['GZ', 400],
  ];
  public dayNumber = 7;
  public loaded = false;
  public recDeaTotalCases: AreaData[] = [];
  public showRecDeadTotal = false;
  public colorScheme = {};
  public countyName = 'Deutschland';
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
  private notifer = new Subject();

  constructor(
    private infections: InfectionsService,
    public resize: ResizeService
    ) {
    // calculate days for all time span
    const date = new Date();
    date.setHours(1, 0, 0);
    const startDate = new Date('2020-03-14');
    startDate.setHours(0, 0, 0);
    let diff = date.getTime() - startDate.getTime();
    diff = Math.round(diff / (1000 * 3600 * 24));
    this.timeSpan[this.timeSpan.length - 1][1] = diff;
    this.timeSpanMobile[this.timeSpan.length - 1][1] = diff;

    this.infections.getSelectedCountyInfo().pipe(takeUntil(this.notifer)).subscribe((id) => {
      this.loadData(id);
    });
  }

  ngOnInit(): void {
    this.loadData(0);
    this.colorScheme = this.incidence7ColorScheme;
  }

  ngOnDestroy(): void {
    this.notifer.next();
    this.notifer.complete();
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
      this.dayNumber = this.timeSpan[0][1];
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
      this.dayNumber = this.timeSpan[this.timeSpan.length - 1][1];
    }
  }

  /**
   * loads the data for a specific county
   * @param id of the county
   */
  private loadData(id: number): void {
    this.infections.loadData(id).then(
      (bool) => {
        this.loaded = bool;
        this.recDeaTotalCases = this.infections.recoveredDeathsTotalCases;
        this.countyName = this.infections.getCountyNameFromId(
          this.infections.selectedCountyId
        );
      },
      (err) => {
        console.log('error load Data', err);
      }
    );
  }
}
