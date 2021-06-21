import { Injectable } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly key: string = 'favorites';
  private readonly favorites = [] as number[];

  constructor(private clipboardService: ClipboardService) {
    const rawData = localStorage.getItem(this.key);
    if (rawData != null) {
      const parsedData = JSON.parse(rawData);
      this.favorites = this.cleanUpArray(parsedData);
    }
  }

  public toggleFavorite(id: number) {
    this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
  }

  public replaceFavorites(ids: Array<number>) {
    this.cleanUpArray(ids).forEach((id) => this.addFavorite(id));
    this.syncLocalStorage();
  }

  public generateShareLink() {
    let shareLink = 'https://covidash.de/share/';
    this.favorites.forEach((id, index) => {
      shareLink += id + (index == this.favorites.length - 1 ? '' : ',');
    });
    this.clipboardService.copy(shareLink);
  }

  private addFavorite(id: number) {
    this.favorites.push(id);
    this.syncLocalStorage();
  }

  private removeFavorite(id: number) {
    const index: number = this.favorites.indexOf(id);
    this.favorites.splice(index, 1);
    this.syncLocalStorage();
  }

  public isFavorite(id: number): boolean {
    return this.favorites.includes(id);
  }

  private syncLocalStorage() {
    localStorage.setItem(this.key, JSON.stringify(this.cleanUpArray()));
  }

  private cleanUpArray(array: Array<number> = this.favorites): Array<number> {
    return Array.from(new Set(array)).sort((a, b) => a - b);
  }
}