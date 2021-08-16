/* eslint-disable @typescript-eslint/no-empty-function */
import type {OnInit} from '@angular/core';
import {Component} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ResizeService } from 'src/app/services/resize/resize.service';

@Component({
  selector: 'app-vaccinations',
  templateUrl: './vaccinations.component.html',
  styleUrls: ['./vaccinations.component.scss'],
})
export class VaccinationsComponent implements OnInit {
  constructor(
    public resize: ResizeService
  ) {
  }

  ngOnInit(): void {
  }
}
