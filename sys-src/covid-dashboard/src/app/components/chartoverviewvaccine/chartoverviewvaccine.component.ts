import { Component, OnInit } from '@angular/core';
import { AreaData, ScaleData, VaccineChartType } from 'src/app/services/alltypes';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';

@Component({
  selector: 'app-chartoverviewvaccine',
  templateUrl: './chartoverviewvaccine.component.html',
  styleUrls: ['./chartoverviewvaccine.component.scss']
})
export class ChartoverviewvaccineComponent implements OnInit {

  public type: VaccineChartType = VaccineChartType.firstandSeond;
  public chartType = VaccineChartType;
  public displayedaredData: AreaData[] = [];
  public allvacsbyManufactor: ScaleData[] = [];
  public timeSpan: [string, number][] = [
    ['1 Woche', 7],
    ['2 Wochen', 14],
    ['3 Wochen', 21],
    ['1 Monat', 30],
    ['3 Monate', 90],
    ['6 Monate', 180],
    ['gesamter Zeitraum', 200],
  ];
  public dayNumber: number = 7;
  public showpercentVaccines: boolean = false;

  constructor(
    private vaccine: VaccinesService,
  ) {
    this.vaccine.loadData(2).then((bool) => {
      console.log('bool', bool);
      this.displayedaredData = this.vaccine.firstSecondVaccinationSum;
      this.allvacsbyManufactor = this.vaccine.allVaccinsbyManufactor;
    })

     // calculate days for all time span
     const date = new Date();
     date.setHours(1, 0, 0);
     const startDate = new Date('2020-12-29');
     startDate.setHours(0, 0, 0);
     let diff = date.getTime() - startDate.getTime();
     diff = Math.round(diff / (1000 * 3600 * 24));
     this.timeSpan[this.timeSpan.length - 1][1] = diff;
  }

  ngOnInit(): void {
  }


  public changeType(
    typ:
      | 'firstandSeond'
      | 'percentVaccines'
      | 'timeVaccines'
  ): void {
    this.showpercentVaccines = false;
    if (typ === 'firstandSeond') {
      this.displayedaredData = this.vaccine.firstSecondVaccinationSum;
      this.type = VaccineChartType.firstandSeond;
    } else if (typ === 'percentVaccines') {
      this.showpercentVaccines = true;
      this.type = VaccineChartType.percentVaccines;
    } else if (typ === 'timeVaccines') {
      this.displayedaredData = this.vaccine.allVaccinsbyManTime;
      this.type = VaccineChartType.timeVaccines;
    }
  }

}
