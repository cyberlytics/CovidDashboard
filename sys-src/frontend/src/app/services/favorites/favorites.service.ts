/* eslint-disable @typescript-eslint/consistent-type-imports */
import {Injectable} from '@angular/core';
import {ClipboardService} from "ngx-clipboard";

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly key: string = 'favorites';
  public favorites = [] as number[];

  constructor(private clipboardService: ClipboardService) {
    const rawData = localStorage.getItem(this.key);
    if (rawData != null) {
      const parsedData = JSON.parse(rawData);
      this.favorites = this.cleanUpArray(parsedData);
    }
  }

  /**
   * Add id to favorites if id is not favorite, else remove id from favorites
   * @param id
   */
  public toggleFavorite(id: number): void {
    this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
  }

  /**
   * Clear favorites and add new ids to favorites
   * @param ids
   */
  public replaceFavorites(ids: number[]): void {
    this.cleanUpArray(ids).forEach((id) => this.addFavorite(id));
    this.syncLocalStorage();
  }

  /**
   * Generate a share link
   */
  public generateShareLink(): string {
    let shareLink = 'https://covidash.de/share/';
    this.favorites.forEach((id, index) => {
      shareLink += id + (index === this.favorites.length - 1 ? '' : ',');
    });
    this.clipboardService.copy(shareLink);
    return shareLink;
  }

  /**
   * Check if id in favorite or not
   * @param id
   * @returns true if id is favorite, else instead
   */
  public isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Add new id to favorites
   * @param id
   */
  public addFavorite(id: number): void {
    this.favorites.push(id);
    this.syncLocalStorage();
  }

  /**
   * Remove id from favorites
   * @param id
   */
  public removeFavorite(id: number): void {
    const index: number = this.favorites.indexOf(id);
    this.favorites.splice(index, 1);
    this.syncLocalStorage();
  }

  /**
   * Remove duplicates and sort ids in favorite array ascending
   * @param array
   */
  public cleanUpArray(array: number[] = this.favorites): number[] {
    return Array.from(new Set(array)).sort((a, b) => a - b);
  }

  /**
   * Clean up favorite array, stringify and update LocalStorage
   * @private
   */
  private syncLocalStorage(): void {
    localStorage.setItem(this.key, JSON.stringify(this.cleanUpArray()));
  }
}
