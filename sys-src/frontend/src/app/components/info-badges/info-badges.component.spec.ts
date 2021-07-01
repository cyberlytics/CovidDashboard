import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoBadgesComponent} from './info-badges.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('InfoBadgesComponent', () => {
  let component: InfoBadgesComponent;
  let fixture: ComponentFixture<InfoBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [InfoBadgesComponent]
    })
      .compileComponents();
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
