import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartoverviewinfectionsComponent} from './chartoverviewinfections.component';

describe('ChartoverviewinfectionsComponent', () => {
  let component: ChartoverviewinfectionsComponent;
  let fixture: ComponentFixture<ChartoverviewinfectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartoverviewinfectionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartoverviewinfectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
