/* eslint-disable @typescript-eslint/no-empty-function */
import type {OnInit} from '@angular/core';
import {Component} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ResizeService } from 'src/app/services/resize/resize.service';

@Component({
  selector: 'app-infections',
  templateUrl: './infections.component.html',
  styleUrls: ['./infections.component.scss'],
})
export class InfectionsComponent implements OnInit {
  constructor(public resize: ResizeService) {
  }

  ngOnInit(): void {
  }
}
