/* eslint-disable @typescript-eslint/consistent-type-imports */
import type {OnInit} from '@angular/core';
import {Component, Input} from '@angular/core';
import {NetworkService} from 'src/app/services/network/network.service';
import {FavoritesService} from '../../services/favorites/favorites.service';
import type {CountyCombined, VaccineCombined,} from '../../services/alltypes';
import {VaccinesService} from 'src/app/services/vaccines/vaccines.service';
import {InfectionsService} from 'src/app/services/infections/infections.service';
import { ResizeService } from 'src/app/services/resize/resize.service';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {
  @Input() showInfection = false;
  public selectedFavorites = false;

  public allCountys = [] as CountyCombined[];
  public searchCountys = [] as CountyCombined[];
  public germanyCounty = {} as CountyCombined;

  public allStates = [] as VaccineCombined[];
  public searchStates = [] as VaccineCombined[];
  public germanyVaccine = {} as VaccineCombined;

  public searchTerm = '';
  public pageIndex = 0;
  public tableLength = 4;

  public key = 'County';
  public reverse = false;

  constructor(
    private network: NetworkService,
    public favoriteService: FavoritesService,
    private vaccines: VaccinesService,
    private infections: InfectionsService,
    public resize: ResizeService
  ) {
  }

  // called after the constructor
  ngOnInit(): void {
    if (this.showInfection) {
      this.network.getAllCountyIncidences().subscribe(
        (res) => {
          const tempData: any[] = res;
          // combine the data in one array
          for (let i = 0; i < tempData.length; i++) {
            tempData[i] = tempData[i][1];
          }
          // get diff values for the counties
          this.network.getCountyDiff().subscribe(
            (anwser) => {
              // find diff for every element by using the id
              for (const element of tempData) {
                element.diff = anwser.find(
                  (item) => item[0] === element.CountyId
                )?.[1];
              }
              // save the data to both arrays
              this.allCountys = tempData;
              this.searchCountys = tempData;
              this.findGermanyInCounties();
            },
            (err) => {
              console.log('error get County Diff', err);
            }
          );
        },
        (err) => {
          console.log('error get all county incidences', err);
        }
      );
    } else {
      this.network.getVaccineAllStates().subscribe(
        (res) => {
          const tempData: any[] = res;
          // combine the data in one array and map the name
          for (let i = 0; i < tempData.length; i++) {
            tempData[i] = tempData[i][1];
            tempData[i].StateName = this.vaccines.statesMap.find(
              (item) => item.id === tempData[i].StateId
            )?.name;
          }
          // set the key for searching
          this.key = 'StateName';
          // git diff value for states
          this.network.getStatesWithDiff().subscribe(
            (anwser) => {
              // combine diffs with previous data
              for (const element of tempData) {
                element.diff = anwser.find(
                  (item) => item[0] === element.StateId
                )?.[1];
              }
              // save the data to both arrays
              this.allStates = tempData;
              this.searchStates = tempData;
              this.findGermanyInStates();
            },
            (err) => {
              console.log('error get states Diff', err);
            }
          );
        },
        (err) => {
          console.log('error get vaccine all states', err);
        }
      );
    }
  }

  /**
   * is called for searching the counties
   * @param toggleFavorites search favourite states or all
   */
  public change(toggleFavorites = false): void {
    if (toggleFavorites) {
      this.selectedFavorites = !this.selectedFavorites;
      this.searchTerm = '';
    }

    this.searchCountys = this.allCountys.filter((s) => {
      const countyId = s.CountyId;
      const currentCounty = s.County;
      if (currentCounty !== undefined && countyId !== undefined) {
        if (this.selectedFavorites) {
          return (
            this.favoriteService.isFavorite(countyId) &&
            currentCounty.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        } else {
          return currentCounty
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
        }
      } else {
        return false;
      }
    });
  }

  /**
   * is called for searching all states
   */
  public changeStates(): void {
    this.searchStates = this.allStates.filter((s) => {
      const stateId = s.StateId;
      const currentCounty = s.StateName;
      if (currentCounty !== undefined && stateId !== undefined) {
        return currentCounty
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else {
        return false;
      }
    });
  }

  /**
   * sorts the data by the key
   * @param key for sorting
   */
  public sort(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  /**
   * sorts all states
   * @param key for sorting
   */
  public sortStates(key: string): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  /**
   * sets selected county for the other components
   * @param county selected county
   */
  public selectCounty(county: CountyCombined): void {
    this.infections.setSelectedCountyId(county.CountyId);
  }

  /**
   * sets selected state for the other components
   * @param state selected state
   */
  public selectState(state: VaccineCombined): void {
    this.vaccines.setSelectedStateId(state.StateId);
  }

  /**
   * finds germany saves it and removes it from the list
   */
  private findGermanyInStates(): void {
    const temp = this.allStates.findIndex(item => item.StateId === 0);
    if (temp) {
      this.germanyVaccine = this.allStates[temp];
      this.allStates.splice(temp, 1);
    }
  }

  /**
   * finds germany saves it and removes it from the list
   */
  private findGermanyInCounties(): void {
    const temp = this.allCountys.findIndex(item => item.StateId === 0);
    if (temp) {
      this.germanyCounty = this.allCountys[temp];
      this.allCountys.splice(temp, 1);
    }
  }

  public previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
    console.log('page index previous', this.pageIndex);
  }

  public nextPage(): void {
    if (this.pageIndex < this.tableLength) {
      this.pageIndex++;
    }
    console.log('page index next', this.pageIndex);
  }

  onSwipe(evt: any) {
    // const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    // const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    // this.eventText += `${x} ${y}<br/>`;
    console.log('evt', evt);
}
}
