import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { InfectionChartType, ScaleData } from '../../../services/alltypes';
import { NetworkService } from '../../../services/network/network.service';
import { InfectionsService } from '../../../services/infections/infections.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnDestroy {
  // inputs for type, daynumber, colorscheme and loaded
  @Input() type: InfectionChartType = InfectionChartType.incidence7;
  @Input() daynumber: number = 7;
  @Input() loaded: boolean = false;
  @Input() colorScheme = {};
  private notifer = new Subject();

  // displayed array
  public displayedValues = [] as ScaleData[];

  constructor(private infections: InfectionsService) {
    this.infections.newDataLoaded().pipe(takeUntil(this.notifer)).subscribe(() => {
      this.changedInput(this.type, this.daynumber);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
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
}
