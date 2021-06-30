import {TestBed} from '@angular/core/testing';

import {FavoritesService} from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle favourite and is favourite', () => {
    service.toggleFavorite(1);
    expect(service.isFavorite(1)).toBeTruthy();
  });
});
