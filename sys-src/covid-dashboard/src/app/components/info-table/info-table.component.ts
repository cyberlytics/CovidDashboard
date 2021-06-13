import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrls: ['./info-table.component.scss'],
})
export class InfoTableComponent implements OnInit {
  selectedBookmark: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
