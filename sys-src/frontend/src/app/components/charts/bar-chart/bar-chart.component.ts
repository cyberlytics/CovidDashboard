/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { OnChanges, OnDestroy} from '@angular/core';
import {Component, Input, ChangeDetectorRef} from '@angular/core';
import type {ScaleData, SelectedBarElement} from '../../../services/alltypes';
import {InfectionChartType} from '../../../services/alltypes';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {InfectionsService} from '../../../services/infections/infections.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { ResizeService } from 'src/app/services/resize/resize.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnDestroy, OnChanges {
  // inputs for type, daynumber, colorscheme and loaded
  @Input() type: InfectionChartType = InfectionChartType.incidence7;
  @Input() daynumber = 7;
  @Input() loaded = false;
  @Input() colorScheme = {};
  // displayed array
  public displayedValues = [] as ScaleData[];
  private notifer = new Subject();
  public selectedBarElement: SelectedBarElement = {} as SelectedBarElement;

  public xCoordinate = 10;
  public yCoordinate = 10;
  public showDiv = true;
  private _timeout: any;

  constructor(
    private infections: InfectionsService,
    public resize: ResizeService,
    private changeDetection: ChangeDetectorRef
    ) {
    this.infections.newDataLoaded().pipe(takeUntil(this.notifer)).subscribe(() => {
      this.changedInput(this.type, this.daynumber);
    });
  }


  ngOnDestroy(): void {
    this.notifer.next();
    this.notifer.complete();
  }

  /**
   * is called every time the data form the parent component changes
   */
  ngOnChanges(): void {
    this.changedInput(this.type, this.daynumber);
  }

  /**
   * changes the displayed values
   * @param type selected type
   * @param count selected
   */
  private changedInput(type: InfectionChartType, count: number): void {
    if (type === InfectionChartType.incidence7) {
      this.displayedValues = this.infections.incidences.slice();
    } else if (type === InfectionChartType.activeCases) {
      this.displayedValues = this.infections.activeCases.slice();
    } else if (type === InfectionChartType.recovered) {
      this.displayedValues = this.infections.recovered.slice();
    } else if (type === InfectionChartType.deaths) {
      this.displayedValues = this.infections.deaths.slice();
    } else if (type === InfectionChartType.totalCases) {
      this.displayedValues = this.infections.totalCases.slice();
    }

    if (count <= this.displayedValues.length) {
      this.displayedValues = this.displayedValues.splice(
        this.displayedValues.length - count,
        this.displayedValues.length
      );
    }
  }

  public selectedElement(event: any) {
    console.log(event);
    this.selectedBarElement = event;
    this.showDiv = true;
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this.showDiv = false;
    }, 2000);
  }

  public getCoordinates(event: any){
    console.log(event);
    console.log(event.pageX);
    console.log(event.pageY);
    this.xCoordinate = event.pageX - 40;
    this.yCoordinate = event.pageY - 80;
    this.changeDetection.detectChanges();
  }
}
