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
});
