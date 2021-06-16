import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartoverviewComponent } from './chartoverview.component';

describe('ChartoverviewComponent', () => {
  let component: ChartoverviewComponent;
  let fixture: ComponentFixture<ChartoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartoverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
