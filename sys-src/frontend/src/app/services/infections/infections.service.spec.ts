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

  it('shopuld get name from id', () => {
    const name = service.getCountyNameFromId(0);
    expect(name).toBe('Deutschland');
  });

  it('should set selected id', () => {
    service.setSelectedCountyId(0);
    expect(service.selectedCountyId).toBe(0);
  });

});
