import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {InfoBadgesComponent} from './components/info-badges/info-badges.component';

import localeDe from '@angular/common/locales/de';
import {registerLocaleData} from '@angular/common';
import {InfoTableComponent} from './components/info-table/info-table.component';
import {HttpClientModule} from '@angular/common/http';
import {VaccineProgressBarComponent} from './components/vaccine-progress-bar/vaccine-progress-bar.component';
import {FooterComponent} from './components/footer/footer.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BarchartComponent} from './components/barchart/barchart.component';
import {AreachartComponent} from './components/areachart/areachart.component';
import {VaccinationsComponent} from './pages/vaccinations/vaccinations.component';
import {InfectionsComponent} from './pages/infections/infections.component';
import {FormsModule} from '@angular/forms';
import {ChartoverviewvaccineComponent} from './components/chartoverviewvaccine/chartoverviewvaccine.component';
import {ChartoverviewinfectionsComponent} from './components/chartoverviewinfections/chartoverviewinfections.component';
import {PiechartComponent} from './components/piechart/piechart.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavBarComponent,
    InfoBadgesComponent,
    InfoTableComponent,
    VaccineProgressBarComponent,
    FooterComponent,
    BarchartComponent,
    AreachartComponent,
    VaccinationsComponent,
    InfectionsComponent,
    ChartoverviewvaccineComponent,
    ChartoverviewinfectionsComponent,
    PiechartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
  ],
  providers: [{provide: LOCALE_ID, useValue: 'de'}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
