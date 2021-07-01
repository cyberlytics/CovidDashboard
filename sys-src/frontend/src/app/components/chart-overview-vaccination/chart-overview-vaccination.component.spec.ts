import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartOverviewVaccinationComponent} from './chart-overview-vaccination.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ChartOverviewVaccinationComponent', () => {
  let component: ChartOverviewVaccinationComponent;
  let fixture: ComponentFixture<ChartOverviewVaccinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChartOverviewVaccinationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOverviewVaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change type', () => {
    component.changeType('percentVaccines');
    fixture.detectChanges();
    expect(component.showPercentVaccines).toBeTruthy();
  });
});
