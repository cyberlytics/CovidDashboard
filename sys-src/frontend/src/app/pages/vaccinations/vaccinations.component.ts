/* eslint-disable @typescript-eslint/no-empty-function */
import type {OnInit} from '@angular/core';
import {Component} from '@angular/core';

@Component({
  selector: 'app-vaccinations',
  templateUrl: './vaccinations.component.html',
  styleUrls: ['./vaccinations.component.scss'],
})
export class VaccinationsComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
