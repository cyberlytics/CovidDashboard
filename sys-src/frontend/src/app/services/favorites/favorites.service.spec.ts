import {fakeAsync, TestBed} from '@angular/core/testing';

import {FavoritesService} from './favorites.service';
import {ClipboardService} from "ngx-clipboard";

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClipboardService]
    });
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return if id is in array', () => {
    service.favorites = [1]

    // Check if function return true when array includes id
    expect(service.isFavorite(1)).toBeTrue();

    // Check if function return false when array not includes id
    expect(service.isFavorite(2)).toBeFalse();
  })

  it('should remove favorite if id is in array', () => {
    service.favorites = [1]
    service.toggleFavorite(1);

    // Check if array not includes 1
    expect(service.favorites.includes(1)).toBeFalse();
  })

  it('should add favorite if id is not in array', () => {
    service.favorites = []
    service.toggleFavorite(1);

    // Check if array includes 1
    expect(service.favorites.includes(1)).toBeTrue();
  })

  it('should call removeFavorite if isFavorite returns true', () => {
    const spy = spyOn(service, 'removeFavorite');

    service.favorites = [1]
    service.toggleFavorite(1);

    // Check if removeFavorite was called
    expect(spy).toHaveBeenCalled();
  })

  it('should call addFavorite if isFavorite returns false', () => {
    const spy = spyOn(service, 'addFavorite');

    service.favorites = []
    service.toggleFavorite(1);

    // Check if addFavorite was called
    expect(spy).toHaveBeenCalled();
  })

  it('should call syncLocalStorage', () => {
    const spy = spyOn(service, 'syncLocalStorage');

    service.favorites = [1]
    service.replaceFavorites([2]);

    // Check if syncLocalStorage was called
    expect(spy).toHaveBeenCalled();
  })

  it('should contain the correct share link', () => {
    service.favorites = [1, 2, 3]

    // Check for correct link
    expect(service.generateShareLink() === ('https://covidash.de/share/1,2,3')).toBeTrue();
  })

  it('should add id to array', () => {
    service.favorites = []
    service.addFavorite(1);

    // Check if array includes 1
    expect(service.favorites.includes(1)).toBeTrue();
  })

  it('should call syncLocalStorage', () => {
    const spy = spyOn(service, 'syncLocalStorage');

    service.favorites = []
    service.addFavorite(1);

    // Check if syncLocalStorage was called
    expect(spy).toHaveBeenCalled();
  })

  it('should remove id from array', () => {
    service.favorites = [1]
    service.removeFavorite(1);

    // Check if array not includes 1
    expect(service.favorites.includes(1)).toBeFalse();
  })

  it('should call syncLocalStorage', () => {
    const spy = spyOn(service, 'syncLocalStorage');

    service.favorites = [1]
    service.removeFavorite(1);

    // Check if syncLocalStorage was called
    expect(spy).toHaveBeenCalled();
  })

  it('should remove duplicate ids from array', () => {
    service.favorites = [3, 1, 2, 2]
    const testNumberArray = service.cleanUpArray() as number[];

    // Check if array includes 1, 2 and 3
    expect(testNumberArray.includes(1)).toBeTrue();
    expect(testNumberArray.includes(2)).toBeTrue();
    expect(testNumberArray.includes(3)).toBeTrue();

    // Check if duplicates where removed
    expect(testNumberArray.length).toBe(3);

    // Check if array is sorted ascending
    expect(testNumberArray.every((x, i) => {
      return i === 0 || x >= testNumberArray[i - 1];
    })).toBeTrue();
  })

  it('should call localStorage.setItem', fakeAsync(() => {
    const spy = spyOn(localStorage, 'setItem');

    service.syncLocalStorage();

    // Check if localStorage.setItem was called
    expect(spy).toHaveBeenCalled();
  }))
});
