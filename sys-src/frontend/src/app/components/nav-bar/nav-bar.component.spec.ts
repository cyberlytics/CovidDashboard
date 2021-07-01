import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {NavBarComponent} from './nav-bar.component';
import {RouterTestingModule} from "@angular/router/testing";
import { routes } from 'src/app/app-routing.module';
import { Router } from '@angular/router';

const defaultShareButtonText: string = "Favoriten teilen"

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

  it('should have shareButtonText', () => {
    // Check if shareButtonText has correct default text
    expect(component.shareButtonText).toBe(defaultShareButtonText);
  });

  it('should change shareButtonText', fakeAsync(() => {
    component.generateShareLink();

    // Check if shareButtonText changed to new value
    expect(component.shareButtonText).toBe("Kopiert");

    // Wait 1500ms
    tick(1500);

    // Check if shareButtonText changed back to default text
    expect(component.shareButtonText).toBe(defaultShareButtonText);
  }));
});
