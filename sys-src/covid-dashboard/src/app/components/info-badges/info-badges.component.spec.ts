import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBadgesComponent } from './info-badges.component';

describe('InfoBadgesComponent', () => {
  let component: InfoBadgesComponent;
  let fixture: ComponentFixture<InfoBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoBadgesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
