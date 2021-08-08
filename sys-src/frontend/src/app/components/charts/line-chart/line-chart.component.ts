/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AreaData, InfectionChartType, ScaleData } from 'src/app/services/alltypes';
import { InfectionsService } from 'src/app/services/infections/infections.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  // inputs for type, daynumber, colorscheme and loaded
  @Input() type: InfectionChartType = InfectionChartType.incidence7;
  @Input() daynumber = 7;
  @Input() loaded = false;
  @Input() colorScheme = {};
  // displayed array
  public dispValues = [] as AreaData[];
  private notifer = new Subject();

  constructor(private infections: InfectionsService) {
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
      this.dispValues = [{name: 'Inzidenzen', series: this.infections.incidences.slice()}];
    }

    for (const element of this.dispValues) {
      if (count <= element.series.length) {
        element.series = element.series.splice(
          element.series.length - count,
          element.series.length
        );
      }
    }
  }
}
