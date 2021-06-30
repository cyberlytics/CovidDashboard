import type { OnInit} from '@angular/core';
import {Component, Input} from '@angular/core';
import type {ScaleData} from '../../../services/alltypes';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  // inputs for data and colorscheme
  @Input() data: ScaleData[] = [];
  @Input() colorScheme = {};

  // displayed data
  public displayedValues = [] as ScaleData[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
  }
}
