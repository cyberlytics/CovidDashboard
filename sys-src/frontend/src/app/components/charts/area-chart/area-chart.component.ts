import type { OnChanges } from '@angular/core';
import {Component, Input} from '@angular/core';
import type {AreaData} from '../../../services/alltypes';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements  OnChanges {
  // inputs for data, daynumber and colorscheme
  @Input() data: AreaData[] = [];
  @Input() dayNumber = 7;
  @Input() colorScheme = {};
  @Input() stacked = false;

  // array which displays the data
  public displayedData: AreaData[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  /**
   * is called every time the data form the parent component changes
   */
  ngOnChanges(): void {
    this.changedInput();
  }

  /**
   * gets the new data and trims the array to the selected time span
   */
  private changedInput(): void {
    this.displayedData = [];
    for (const item of this.data) {
      this.displayedData.push({name: item.name, series: item.series.slice()});
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
