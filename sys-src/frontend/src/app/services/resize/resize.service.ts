import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
    // only used for deciding if view is mobile or desktop
    private _isMobile = false;
    private _navBarIsShown = true;
    public currentWidth = 1920;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    public get isMobile (): boolean {
      return this._isMobile
    }

    public set isMobile(value: boolean) {
      this._isMobile = value;
    }

    public get navBarIsShown(): boolean {
      return this._navBarIsShown;
    }

    public set navBarIsShown(value: boolean) {
      this._navBarIsShown = value;
      localStorage.setItem('navBar', this._navBarIsShown.toString());
    }

    // public set currentWidth(value: number) {
    //   console.log('curentwidht', value)
    //   if (value) {
    //     this._currentWidth = value;
    //     console.log(this._currentWidth)
    //   }
    // }

    // public get currentWidht(): number {
    //   console.log('cure ', this._currentWidth)
    //   return this._currentWidth;
    // }
}
