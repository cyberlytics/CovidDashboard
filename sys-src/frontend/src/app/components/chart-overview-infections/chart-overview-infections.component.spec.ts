/* eslint-disable @typescript-eslint/consistent-type-imports */
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartOverviewInfectionsComponent} from './chart-overview-infections.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ChartOverviewInfectionsComponent', () => {
  let component: ChartOverviewInfectionsComponent;
  let fixture: ComponentFixture<ChartOverviewInfectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChartOverviewInfectionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOverviewInfectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change type', () => {
    component.changeType('recDeadTotal');
    fixture.detectChanges();
    expect(component.recDeaTotalCases).toBeTruthy();
  });
});
