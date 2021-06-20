import {Component, OnInit} from '@angular/core';
import {GermanyData} from 'src/app/services/alltypes';
import {NetworkService} from 'src/app/services/network/network.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-info-badges',
  templateUrl: './info-badges.component.html',
  styleUrls: ['./info-badges.component.scss'],
})
export class InfoBadgesComponent implements OnInit {
  showInfectionData = false;

  public germanyData: GermanyData = {} as GermanyData;

  constructor(private network: NetworkService, private router: Router) {
    this.network.getSummaryGermany().subscribe((res) => {
      console.log('res', res);
      this.germanyData = res;
    });
  }

  ngOnInit(): void {
    this.showInfectionData = this.router.url.includes('infections');
  }
}
