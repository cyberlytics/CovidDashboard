import {Component, Input, OnChanges, OnInit, SimpleChanges,} from '@angular/core';
import {AreaData} from 'src/app/services/alltypes';

@Component({
  selector: 'app-areachart',
  templateUrl: './areachart.component.html',
  styleUrls: ['./areachart.component.scss'],
})
export class AreachartComponent implements OnInit, OnChanges {
  @Input() data: AreaData[] = [];
  @Input() dayNumber: number = 7;
  public displayedData: AreaData[] = [];

  @Input() colorScheme = {};

  constructor() {
  }

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
      if (this.dayNumber <= element.series.length) {
        element.series = element.series.splice(
          element.series.length - this.dayNumber,
          element.series.length
        );
      }
    }
  }
}
