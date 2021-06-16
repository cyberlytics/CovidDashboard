import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AreaData } from 'src/app/services/infections/infections.service';

@Component({
  selector: 'app-areachart',
  templateUrl: './areachart.component.html',
  styleUrls: ['./areachart.component.scss']
})
export class AreachartComponent implements OnInit, OnChanges {


  @Input() data: AreaData[] = [];
  @Input() daynumber: number = 7;
  public displayedData: AreaData[] = [];

  view: number[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    this.changedInput();
  }

  private changedInput(): void {
    this.displayedData = [];
    for (const item of this.data) {
      this.displayedData.push({name: item.name, series: item.series.slice()});
    }

    for (const element of this.displayedData) {
      if (this.daynumber <= element.series.length){
        element.series = element.series.splice(element.series.length - this.daynumber, element.series.length);
      }
    }
  }


}
