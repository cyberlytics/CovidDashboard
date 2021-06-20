import { Component, Input, OnInit } from '@angular/core';
import { ScaleData } from '../../../services/alltypes';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input() data: ScaleData[] = [];
  @Input() colorScheme = {};

  public displayedValues = [] as ScaleData[];

  constructor() {}

  ngOnInit(): void {}
}
