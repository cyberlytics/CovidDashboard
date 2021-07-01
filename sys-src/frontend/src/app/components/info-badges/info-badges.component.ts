import type {OnInit} from '@angular/core';
import {Component} from '@angular/core';
import type {GermanyData, GermanyDataDiff} from 'src/app/services/alltypes';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {NetworkService} from 'src/app/services/network/network.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {Router} from '@angular/router';

@Component({
  selector: 'app-info-badges',
  templateUrl: './info-badges.component.html',
  styleUrls: ['./info-badges.component.scss'],
})
export class InfoBadgesComponent implements OnInit {
  public germanyData: GermanyData = {} as GermanyData;
  public showInfectionData = false;
  public germanyDataDiff: GermanyDataDiff = {} as GermanyDataDiff;

  constructor(private network: NetworkService, private router: Router) {
  }

  ngOnInit(): void {
    this.network.getSummaryGermany().subscribe((res) => {
      this.germanyData = res;
      this.network.getSummaryDiff().subscribe((anwser) => {
        console.log(anwser);
        this.germanyDataDiff = anwser;
      });
    });

    this.showInfectionData = this.router.url.includes('infections');
  }
}