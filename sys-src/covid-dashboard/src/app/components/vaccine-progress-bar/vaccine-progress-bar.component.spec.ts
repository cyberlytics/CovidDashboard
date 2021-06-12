import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineProgressBarComponent } from './vaccine-progress-bar.component';

describe('VaccineProgressBarComponent', () => {
  let component: VaccineProgressBarComponent;
  let fixture: ComponentFixture<VaccineProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccineProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccineProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
