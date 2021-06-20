import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartoverviewvaccineComponent} from './chartoverviewvaccine.component';

describe('ChartoverviewvaccineComponent', () => {
  let component: ChartoverviewvaccineComponent;
  let fixture: ComponentFixture<ChartoverviewvaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartoverviewvaccineComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartoverviewvaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
