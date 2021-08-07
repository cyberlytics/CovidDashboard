/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { ResizeService } from 'src/app/services/resize/resize.service';
import {FavoritesService} from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public shareButtonText = 'Favoriten teilen';
  public showNavbar = true;

  constructor(
    private router: Router,
    public favoriteService: FavoritesService,
    public resize: ResizeService
  ) {
    this.showNavbar = this.resize.navBarIsShown;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
  }

  /**
   * Navigate to other dashboard
   */
  navigate(): void {
    if (this.router.url.includes('infections')) {
      this.router.navigate(['/vaccinations']).then(() => {
      });
    } else {
      this.router.navigate(['/infections']).then(() => {
      });
    }
  }

  /**
   * Generate and copy share link
   */
  generateShareLink(): void {
    this.favoriteService.generateShareLink();
    this.shareButtonText = 'Kopiert';
    setTimeout(() => {
      this.shareButtonText = 'Favoriten teilen';
    }, 1500);
  }

  public changeNavBarDisplay(): void {
    this.showNavbar = !this.showNavbar;
    this.resize.navBarIsShown = !this.resize.navBarIsShown;
    localStorage.setItem('navBar', this.showNavbar.toString());
  }
}
