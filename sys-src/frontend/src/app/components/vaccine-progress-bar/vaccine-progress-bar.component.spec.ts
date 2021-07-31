import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VaccineProgressBarComponent} from './vaccine-progress-bar.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('VaccineProgressBarComponent', () => {
  let component: VaccineProgressBarComponent;
  let fixture: ComponentFixture<VaccineProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VaccineProgressBarComponent]
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
