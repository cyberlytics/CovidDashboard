// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {ChangeDetectorRef, OnChanges} from '@angular/core';
import {Component, Input} from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ResizeService } from 'src/app/services/resize/resize.service';
import type {AreaData} from '../../../services/alltypes';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnChanges {
  // inputs for data, daynumber and colorscheme
  @Input() data: AreaData[] = [];
  @Input() dayNumber = 7;
  @Input() colorScheme = {};
  @Input() stacked = false;

  public legendPos: LegendPosition = LegendPosition.Below;
  // public view: any[] = [300,400];
  view: [number, number] = [700, 300];

  // array which displays the data
  public displayedData: AreaData[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    public resize: ResizeService,
    private changeDetection: ChangeDetectorRef
  ) {
    if (this.resize.isMobile) {
      this.legendPos = LegendPosition.Below;
    } else {
      this.legendPos = LegendPosition.Right;
    }

    console.log(this.resize.currentWidth);
    this.view[0] = this.resize.currentWidth - 40;
    console.log('view', this.view);
    console.log('moblie', this.resize.isMobile)
  }

  /**
   * is called every time the data form the parent component changes
   */
  ngOnChanges(): void {
    this.changedInput();
    this.changeDetection.detectChanges()
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
