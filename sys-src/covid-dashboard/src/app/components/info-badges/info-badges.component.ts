import { Component, OnInit } from '@angular/core';
import { GermanyData } from 'src/app/services/county';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-info-badges',
  templateUrl: './info-badges.component.html',
  styleUrls: ['./info-badges.component.scss'],
})
export class InfoBadgesComponent implements OnInit {
  lastUpdated = new Date();
  public germanyData: GermanyData = {} as GermanyData;

  constructor(private network: NetworkService) {
    this.network.getSummaryGermany().subscribe((res) => {
      console.log('res', res);
      this.germanyData = res;
    });
  }

  ngOnInit(): void {}
}
