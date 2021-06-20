import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOverviewVaccinationComponent } from './chart-overview-vaccination.component';

describe('ChartOverviewVaccinationComponent', () => {
  let component: ChartOverviewVaccinationComponent;
  let fixture: ComponentFixture<ChartOverviewVaccinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartOverviewVaccinationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOverviewVaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
