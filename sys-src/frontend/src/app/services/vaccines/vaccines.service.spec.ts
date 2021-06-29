import {TestBed} from '@angular/core/testing';

import {VaccinesService} from './vaccines.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('VaccinesService', () => {
  let service: VaccinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VaccinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
