import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public shareButtonText: string = 'Favoriten teilen';

  constructor(
    private router: Router,
    public favoriteService: FavoritesService
  ) {}

  ngOnInit(): void {}

  navigate(): void {
    if (this.router.url.includes('infections')) {
      this.router.navigate(['/vaccinations']).then(() => {});
    } else {
      this.router.navigate(['/infections']).then(() => {});
    }
  }

  generateShareLink() {
    this.favoriteService.generateShareLink();
    this.shareButtonText = 'Kopiert';
    setTimeout(() => {
      this.shareButtonText = 'Favoriten teilen';
    }, 1500);
  }
}
