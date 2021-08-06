import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
    // only used for deciding if view is mobile or desktop
    public isMobile = false;
    public navBarIsShown = true;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
}
