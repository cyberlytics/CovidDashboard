import {Component, OnInit} from '@angular/core';
import {NetworkService} from '../../services/network/network.service';

@Component({
  selector: 'app-vaccine-progress-bar',
  templateUrl: './vaccine-progress-bar.component.html',
  styleUrls: ['./vaccine-progress-bar.component.scss'],
})
export class VaccineProgressBarComponent implements OnInit {
  progressFirstVaccinated: number = 0.0;
  progressFullyVaccinated: number = 0.0;

  lastUpdated: string = 'Lädt...';

  constructor(private network: NetworkService) {
    this.network.getSummaryGermany().subscribe((res) => {
      this.progressFirstVaccinated = res.vaccines.ProportionFirstVaccinations;
      this.progressFullyVaccinated = res.vaccines.ProportionSecondVaccinations;
      this.lastUpdated = res.vaccines.Date;
    });
  }

  ngOnInit(): void {
  }
}
