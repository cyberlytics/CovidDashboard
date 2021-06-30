import {TestBed} from '@angular/core/testing';

import {NetworkService} from './network.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get summary data', async() => {
    service.getSummaryDiff().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get all county incidneces data', async() => {
    service.getAllCountyIncidences().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get county diff data', async() => {
    service.getCountyDiff().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get county overview data', async() => {
    service.getCountyOverview().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get county incidences data', async() => {
    service.getSingleCountyIncidences(9741).subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get states with diff data', async() => {
    service.getStatesWithDiff().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get summary germany data', async() => {
    service.getSummaryGermany().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get vaccine all states data', async() => {
    service.getVaccineAllStates().subscribe(x => {
      expect(x).toBeDefined();
    })
  });

  it('should get vaccine single states data', async() => {
    service.getVaccineSingleState(1).subscribe(x => {
      expect(x).toBeDefined();
    })
  });

});
