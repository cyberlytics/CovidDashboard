import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vaccine-progress-bar',
  templateUrl: './vaccine-progress-bar.component.html',
  styleUrls: ['./vaccine-progress-bar.component.scss'],
})
export class VaccineProgressBarComponent implements OnInit {
  progressFirstVaccinated: number = 50.0;
  progressFullyVaccinated: number = 15.0;

  lastUpdated = new Date();

  constructor() {}

  ngOnInit(): void {}
}
