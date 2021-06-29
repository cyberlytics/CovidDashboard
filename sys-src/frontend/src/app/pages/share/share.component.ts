import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FavoritesService} from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent implements OnInit {
  private sharedIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoriteService: FavoritesService
  ) {
    this.route.paramMap.subscribe((params) => {
      const idsString = params.getAll('id').toString().split(',');
      for (let i = 0; i < idsString.length; i++) {
        let tempValue = parseInt(idsString[i], 10);
        if (!Number.isNaN(tempValue)) {
          this.sharedIds.push(tempValue);
        }
      }
      if (this.sharedIds.length > 0) {
        this.favoriteService.replaceFavorites(this.sharedIds);
      }
      this.router.navigate(['infections']);
    });
  }

  ngOnInit(): void {
  }
}
