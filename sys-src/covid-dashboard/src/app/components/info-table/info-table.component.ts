import { Component, Input, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { County, Vaccine, VaccineCombined } from '../../services/alltypes';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {

  @Input() showInfection: boolean = false;
  public selectedFavorites: boolean = false;

  public allCountys = [] as County[];
  public searchCountys = [] as County[];

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

  ngOnInit(): void {
    if (this.showInfection) {
      this.network.getAllCountyIncidences().subscribe((res) => {
        let tempData: Array<any> = res;
        for (let i = 0; i < tempData.length; i++) {
          tempData[i] = tempData[i][1];
        }
        this.allCountys = tempData;
        this.searchCountys = tempData;
        // console.log(tempData);
      });
    } else {
      this.network.getVaccineAllStates().subscribe((res) => {
        let tempData: Array<any> = res;
        for (let i = 0; i < tempData.length; i++) {
          tempData[i] = tempData[i][1];
          tempData[i].StateName = this.vaccines.statesMap.find(item => item.id === tempData[i].StateId)?.name;
        }
        console.log(tempData);
        // this.searchStates = tempData;
        this.key = 'StateName';
        this.network.getStatesWithDiff().subscribe((anwser) => {
          console.log(anwser);
          for (const element of tempData) {
            element.diff = anwser.find(item => item[0] === element.StateId)?.[1];
          }
          this.allStates = tempData;
          this.searchStates = tempData;
          console.log(this.allStates)
        })
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
