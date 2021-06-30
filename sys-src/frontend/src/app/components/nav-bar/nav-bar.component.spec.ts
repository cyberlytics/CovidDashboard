/* eslint-disable @typescript-eslint/consistent-type-imports */
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NavBarComponent} from './nav-bar.component';
import {RouterTestingModule} from "@angular/router/testing";
import { routes } from 'src/app/app-routing.module';
import { Router } from '@angular/router';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [NavBarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate share link', () => {
    component.generateShareLink();
    fixture.detectChanges();
    expect(component.shareButtonText).toBe('Kopiert');
  });

  // it('should generate navigate', () => {
  //   component.navigate();
  //   fixture.detectChanges();
  //   expect(location.pathname.endsWith('/vaccinations')).toBeTruthy();
  // });
});
