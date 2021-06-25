import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InfectionsService } from 'src/app/services/infections/infections.service';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';
import { NetworkService } from '../../services/network/network.service';

@Component({
  selector: 'app-vaccine-progress-bar',
  templateUrl: './vaccine-progress-bar.component.html',
  styleUrls: ['./vaccine-progress-bar.component.scss'],
})
export class VaccineProgressBarComponent implements OnInit {
  public progressFirstVaccinated: number = 0.0;
  public progressFullyVaccinated: number = 0.0;
  private notifer = new Subject();
  public selectedState: string = 'Deutschland';

  public lastUpdated: string = '';

  constructor(
    private network: NetworkService,
    private vaccines: VaccinesService
    ) {
    this.vaccines.getSelectedStateInfo().pipe(takeUntil(this.notifer)).subscribe((id) => {
      this.loadData(id);
      console.log('hier mit id', id)
    });

    this.vaccines.newDataLoaded().subscribe(() => {
      console.log('laoasdf')
      console.log(this.vaccines.selectedStateId);
      this.selectedState = this.vaccines.getStateNameFromId(this.vaccines.selectedStateId);
      this.progressFirstVaccinated = this.vaccines.proportionFirstVaccinations[this.vaccines.proportionFirstVaccinations.length - 1].value;
      this.progressFullyVaccinated = this.vaccines.proportionSecondVaccinations[this.vaccines.proportionSecondVaccinations.length - 1].value;


    })
  }

  ngOnInit(): void {
    this.loadData(0);
  }

  private loadData(id: number) {
    if (id === 0) {
      this.network.getSummaryGermany().subscribe((res) => {
        this.progressFirstVaccinated = res.vaccines.ProportionFirstVaccinations;
        this.progressFullyVaccinated = res.vaccines.ProportionSecondVaccinations;
        this.lastUpdated = res.vaccines.Date;
      });
    }
  }
}
