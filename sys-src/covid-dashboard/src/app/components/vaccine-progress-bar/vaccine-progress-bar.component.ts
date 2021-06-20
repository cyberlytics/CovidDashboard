import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network/network.service';

@Component({
  selector: 'app-vaccine-progress-bar',
  templateUrl: './vaccine-progress-bar.component.html',
  styleUrls: ['./vaccine-progress-bar.component.scss'],
})
export class VaccineProgressBarComponent implements OnInit {
  public progressFirstVaccinated: number = 0.0;
  public progressFullyVaccinated: number = 0.0;

  public lastUpdated: string = '';

  constructor(private network: NetworkService) {}

  ngOnInit(): void {
    this.network.getSummaryGermany().subscribe((res) => {
      this.progressFirstVaccinated = res.vaccines.ProportionFirstVaccinations;
      this.progressFullyVaccinated = res.vaccines.ProportionSecondVaccinations;
      this.lastUpdated = res.vaccines.Date;
    });
  }
}
