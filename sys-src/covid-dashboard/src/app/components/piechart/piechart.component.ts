import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ScaleData } from 'src/app/services/alltypes';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {

  @Input() data: ScaleData[] = [];

  public displayedValues = [] as ScaleData[];

  constructor() { }

  ngOnInit(): void {
  }



}
