import type { OnDestroy, OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import type {AreaData, ScaleData} from '../../services/alltypes';
import { VaccineChartType} from '../../services/alltypes';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {VaccinesService} from '../../services/vaccines/vaccines.service';

@Component({
  selector: 'app-chart-overview-vaccination',
  templateUrl: './chart-overview-vaccination.component.html',
  styleUrls: ['./chart-overview-vaccination.component.scss'],
})
export class ChartOverviewVaccinationComponent implements OnInit, OnDestroy {
  public type: VaccineChartType = VaccineChartType.percentVaccines;
  public timeSpan: [string, number][] = [
    ['1 Woche', 7],
    ['2 Wochen', 14],
    ['3 Wochen', 21],
    ['1 Monat', 30],
    ['3 Monate', 90],
    ['6 Monate', 180],
    ['Gesamter Zeitraum', 200],
  ];
  public displayedAreaData: AreaData[] = [];
  public allVaccinesByManufacturer: ScaleData[] = [];
  public dayNumber = 7;
  public showPercentVaccines = true;
  public colorScheme = {};
  public stateName = 'Deutschland';
  readonly chartType = VaccineChartType;
  readonly percentVaccinesColorScheme = {
    domain: ['#62d87b', '#a81dff', '#ffc71d', '#cbd5de'],
  };
  readonly timeVaccinesColorScheme = {
    domain: ['#62d87b', '#a81dff', '#ffc71d', '#cbd5de'],
  };
  readonly firstAndSecondColorScheme = {
    domain: ['#529bf2', '#ffc71d'],
  };
  private notifer = new Subject();

  constructor(private vaccine: VaccinesService) {
    this.loadData(0);

    // calculate days for all time span
    const date = new Date();
    date.setHours(1, 0, 0);
    const startDate = new Date('2020-12-29');
    startDate.setHours(0, 0, 0);
    let diff = date.getTime() - startDate.getTime();
    diff = Math.round(diff / (1000 * 3600 * 24));
    this.timeSpan[this.timeSpan.length - 1][1] = diff;

    this.vaccine.getSelectedStateInfo().pipe(takeUntil(this.notifer)).subscribe((id) => {
      this.loadData(id);
    });

  }

  ngOnInit(): void {
    this.colorScheme = this.percentVaccinesColorScheme;
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
    typ: 'firstAndSecond' | 'percentVaccines' | 'timeVaccines'
  ): void {
    this.showPercentVaccines = false;
    if (typ === 'firstAndSecond') {
      this.displayedAreaData = this.vaccine.firstSecondVaccinationSum;
      this.type = VaccineChartType.firstAndSecond;
      this.colorScheme = this.firstAndSecondColorScheme;
      this.dayNumber = this.timeSpan[this.timeSpan.length - 1][1];
    } else if (typ === 'percentVaccines') {
      this.showPercentVaccines = true;
      this.type = VaccineChartType.percentVaccines;
      this.colorScheme = this.percentVaccinesColorScheme;
    } else if (typ === 'timeVaccines') {
      this.displayedAreaData = this.vaccine.allVaccinesByManTime;
      this.type = VaccineChartType.timeVaccines;
      this.colorScheme = this.timeVaccinesColorScheme;
      this.dayNumber = this.timeSpan[4][1];
    }
  }

  /**
   * loads the data for a specific state
   * @param id of the state
   */
  private loadData(id: number): void {
    console.log(this.type)
    this.vaccine.loadData(id).then(() => {
      if (this.type === VaccineChartType.firstAndSecond) {
        this.displayedAreaData = this.vaccine.firstSecondVaccinationSum;
      } else if (this.type === VaccineChartType.timeVaccines) {
        this.displayedAreaData = this.vaccine.allVaccinesByManTime;
      }
      this.allVaccinesByManufacturer = this.vaccine.allVaccinesByManufacturer;
      this.stateName = this.vaccine.getStateNameFromId(
        this.vaccine.selectedStateId
      );
    });
  }
}
