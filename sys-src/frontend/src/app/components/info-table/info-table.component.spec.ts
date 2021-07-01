/* eslint-disable @typescript-eslint/consistent-type-imports */
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoTableComponent} from './info-table.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {OrderModule} from "ngx-order-pipe";

describe('InfoTableComponent', () => {
  let component: InfoTableComponent;
  let fixture: ComponentFixture<InfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderModule],
      declarations: [InfoTableComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort states', () => {
    component.reverse = true;
    component.sortStates('stateID');
    fixture.detectChanges();
    expect(component.key).toBe('stateID');
    expect(component.reverse).toBeFalsy();
  })

  it('should sort ', () => {
    component.reverse = true;
    component.sort('countyID');
    fixture.detectChanges();
    expect(component.key).toBe('countyID');
    expect(component.reverse).toBeFalse();
  })

  it('should find search states', () => {
    component.changeStates();
    fixture.detectChanges();
    expect(component.searchStates).toBeDefined();
  })

  it('should find search county', () => {
    component.change();
    fixture.detectChanges();
    expect(component.searchCountys).toBeDefined();
  })
});
