import {TestBed} from '@angular/core/testing';

import {InfectionsService} from './infections.service';

describe('InfectionsService', () => {
  let service: InfectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
