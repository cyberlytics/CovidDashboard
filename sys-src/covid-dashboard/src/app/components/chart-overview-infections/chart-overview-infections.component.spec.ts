import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOverviewInfectionsComponent } from './chart-overview-infections.component';

describe('ChartOverviewInfectionsComponent', () => {
  let component: ChartOverviewInfectionsComponent;
  let fixture: ComponentFixture<ChartOverviewInfectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartOverviewInfectionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOverviewInfectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
