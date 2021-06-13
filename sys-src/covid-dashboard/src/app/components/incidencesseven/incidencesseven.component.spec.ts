import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidencessevenComponent } from './incidencesseven.component';

describe('IncidencessevenComponent', () => {
  let component: IncidencessevenComponent;
  let fixture: ComponentFixture<IncidencessevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidencessevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidencessevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
