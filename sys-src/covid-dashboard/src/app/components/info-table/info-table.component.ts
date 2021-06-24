import { Component, Input, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { County, CountyCombined, Vaccine, VaccineCombined } from '../../services/alltypes';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {

  @Input() showInfection: boolean = false;
  public selectedFavorites: boolean = false;

  public allCountys = [] as CountyCombined[];
  public searchCountys = [] as CountyCombined[];

  public allStates = [] as VaccineCombined[];
  public searchStates = [] as VaccineCombined[];

  public searchTerm = '';

  public key: string = 'County';
  public reverse: boolean = false;

  constructor(
    private network: NetworkService,
    public favoriteService: FavoritesService,
    private vaccines: VaccinesService
  ) {}

  // called after the constructor
  ngOnInit(): void {
    if (this.showInfection) {
      this.network.getAllCountyIncidences().subscribe((res) => {
        let tempData: Array<any> = res;
        // combine the data in one array
        for (let i = 0; i < tempData.length; i++) {
          tempData[i] = tempData[i][1];
        }
        // get diff values for the counties
        this.network.getCountyDiff().subscribe((anwser) => {
          // find diff for every element by using the id
          for (const element of tempData) {
            element.diff = anwser.find(item => item[0] === element.CountyId)?.[1];
          }
          // save the data to both arrays
          this.allCountys = tempData;
          this.searchCountys = tempData;
          console.log(this.searchCountys)
        }, (err) => {
          console.log('error get County Diff', err);
        })
      }, (err) => {
        console.log('error get all county incidences', err);
      });
    } else {
      this.network.getVaccineAllStates().subscribe((res) => {
        let tempData: Array<any> = res;
        // combine the data in one array and map the name
        for (let i = 0; i < tempData.length; i++) {
          tempData[i] = tempData[i][1];
          tempData[i].StateName = this.vaccines.statesMap.find(item => item.id === tempData[i].StateId)?.name;
        }
        // set the key for searching
        this.key = 'StateName';
        // git diff value for states
        this.network.getStatesWithDiff().subscribe((anwser) => {
          // combine diffs with previous data
          for (const element of tempData) {
            element.diff = anwser.find(item => item[0] === element.StateId)?.[1];
          }
          // save the data to both arrays
          this.allStates = tempData;
          this.searchStates = tempData;
        }, (err) => {
          console.log('error get states Diff', err);
        })
      }, (err) => {
        console.log('error get vaccine all states', err);
      })

    }
  }

  public change(toggleFavorites: boolean = false): void {
    if (toggleFavorites) {
      this.selectedFavorites = !this.selectedFavorites;
    }

    this.searchCountys = this.allCountys.filter((s) => {
      // @ts-ignore
      let countyId = s.CountyId;
      // @ts-ignore
      let currentCounty = s.County;
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
      } else return false;
    });
  }

  public changeStates(): void {
    this.searchStates = this.allStates.filter((s) => {
      // @ts-ignore
      let stateId = s.StateId;
      // @ts-ignore
      let currentCounty = s.StateName;
      if (currentCounty !== undefined && stateId !== undefined) {
        return currentCounty
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else return false;
    });
  }

  public sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  public sortStates(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
