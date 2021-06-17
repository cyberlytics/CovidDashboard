import { Component, OnInit } from '@angular/core';
import { County } from 'src/app/services/county';
import { NetworkService } from 'src/app/services/network/network.service';
import { sort } from 'fast-sort';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {
  selectedBookmark: boolean = false;

  ascSortingState: any = true;
  ascSortingTotalCases: any = null;
  ascSortingActiveCases: any = null;
  ascSortingRecovered: any = null;
  ascSortingIncidence7: any = null;
  ascSortingDeaths: any = null;

  public allCountys = [] as County[];

  constructor(private network: NetworkService) {
    this.network.getAllCountyIncidences().subscribe((res) => {
      this.allCountys = sort(res).asc((county) => county[1].State);
    });
  }

  ngOnInit(): void {}

  // Dirty solution, maybe refactoring later
  sort(type: string): void {
    if (type == 'State') {
      if (!this.ascSortingState) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].State
        );

        this.ascSortingState = true;

        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].State
        );

        this.ascSortingState = false;

        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      }
    } else if (type == 'TotalCases') {
      if (!this.ascSortingTotalCases) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].TotalCases
        );

        this.ascSortingState = null;

        this.ascSortingTotalCases = true;

        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].TotalCases
        );

        this.ascSortingState = null;

        this.ascSortingTotalCases = false;

        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      }
    } else if (type == 'ActiveCases') {
      if (!this.ascSortingActiveCases) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].ActiveCases
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;

        this.ascSortingActiveCases = true;

        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].ActiveCases
        );
        this.ascSortingState = null;
        this.ascSortingTotalCases = null;

        this.ascSortingActiveCases = false;

        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      }
    } else if (type == 'Recovered') {
      if (!this.ascSortingRecovered) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].Recovered
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;

        this.ascSortingRecovered = true;

        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].Recovered
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;

        this.ascSortingRecovered = false;

        this.ascSortingIncidence7 = null;
        this.ascSortingDeaths = null;
      }
    } else if (type == 'Incidence7') {
      if (!this.ascSortingIncidence7) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].Incidence7
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;

        this.ascSortingIncidence7 = true;

        this.ascSortingDeaths = null;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].Incidence7
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;

        this.ascSortingIncidence7 = false;

        this.ascSortingDeaths = null;
      }
    } else if (type == 'Deaths') {
      if (!this.ascSortingDeaths) {
        this.allCountys = sort(this.allCountys).asc(
          (county) => county[1].Deaths
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;

        this.ascSortingDeaths = true;
      } else {
        this.allCountys = sort(this.allCountys).desc(
          (county) => county[1].Deaths
        );

        this.ascSortingState = null;
        this.ascSortingTotalCases = null;
        this.ascSortingActiveCases = null;
        this.ascSortingRecovered = null;
        this.ascSortingIncidence7 = null;

        this.ascSortingDeaths = false;
      }
    }
  }
}
