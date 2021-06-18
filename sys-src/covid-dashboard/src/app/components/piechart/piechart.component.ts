import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';
import { ScaleData } from '../barchart/barchart.component';

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
