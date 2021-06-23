import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { County } from '../../services/alltypes';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {
  public selectedFavorites: boolean = false;

  public allCountys = [] as County[];
  public searchCountys = [] as County[];

  public searchTerm = '';

  public key: string = 'County';
  public reverse: boolean = false;

  constructor(
    private network: NetworkService,
    public favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.network.getAllCountyIncidences().subscribe((res) => {
      let tempData: Array<any> = res;
      for (let i = 0; i < tempData.length; i++) {
        tempData[i] = tempData[i][1];
      }
      this.allCountys = tempData;
      this.searchCountys = tempData;
    });
  }

  change(toggleFavorites: boolean = false): void {
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

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
