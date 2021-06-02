import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-badges',
  templateUrl: './info-badges.component.html',
  styleUrls: ['./info-badges.component.scss'],
})
export class InfoBadgesComponent implements OnInit {
  lastUpdated = new Date();

  constructor() {}

  ngOnInit(): void {}
}
