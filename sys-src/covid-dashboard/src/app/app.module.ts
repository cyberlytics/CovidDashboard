import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { InfoBadgesComponent } from './components/info-badges/info-badges.component';

import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { InfoTableComponent } from './components/info-table/info-table.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavBarComponent,
    HomeComponent,
    InfoBadgesComponent,
    InfoTableComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
