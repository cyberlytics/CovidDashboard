import type { OnInit} from '@angular/core';
import {Component, HostListener} from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ResizeService } from './services/resize/resize.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private resize: ResizeService) {
    console.log(window.innerWidth);
    const navBar = localStorage.getItem('navBar');
    if (navBar === 'true') {
      this.resize.navBarIsShown = true;
    } else if (navBar === null || navBar === undefined) {
      this.resize.navBarIsShown = true;
    } else {
      this.resize.navBarIsShown = false;
    }
  }

  ngOnInit() {
    console.log('oninit')
    this.checkScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreen();
  }

  private checkScreen() {
    this.resize.isMobile = (window.innerWidth < 900);
    // console.log(window.innerWidth);
  }
}
