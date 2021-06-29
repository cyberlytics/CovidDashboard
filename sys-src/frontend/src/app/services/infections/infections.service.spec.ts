import {TestBed} from '@angular/core/testing';

import {InfectionsService} from './infections.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('InfectionsService', () => {
  let service: InfectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(InfectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
