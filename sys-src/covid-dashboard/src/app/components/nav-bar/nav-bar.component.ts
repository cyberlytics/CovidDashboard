import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  navigate(): void {
    if (this.router.url.includes('infections')) {
      this.router.navigate(['/vaccinations']).then(() => {
      });
    } else {
      this.router.navigate(['/infections']).then(() => {
      });
    }
  }
}
