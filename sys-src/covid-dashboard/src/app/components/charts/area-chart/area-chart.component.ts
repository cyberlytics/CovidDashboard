import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AreaData } from '../../../services/alltypes';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnInit {
  @Input() data: AreaData[] = [];
  @Input() dayNumber: number = 7;
  @Input() colorScheme = {};

  public displayedData: AreaData[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.changedInput();
  }

  private changedInput(): void {
    this.displayedData = [];
    for (const item of this.data) {
      this.displayedData.push({ name: item.name, series: item.series.slice() });
    }

    for (const element of this.displayedData) {
      if (this.dayNumber <= element.series.length) {
        element.series = element.series.splice(
          element.series.length - this.dayNumber,
          element.series.length
        );
      }
    }
  }
}
