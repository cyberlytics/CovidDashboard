import { Component, OnInit } from '@angular/core';
import { County } from 'src/app/services/county';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {
  selectedBookmark: boolean = false;

  public allCountys = [] as County[];

  constructor(
    private network: NetworkService
  ) {
    this.network.getAllCountyIncidences().subscribe((res) => {
      // console.log('res in table', res);
      this.allCountys = res;
    })
  }

  ngOnInit(): void {}
}
