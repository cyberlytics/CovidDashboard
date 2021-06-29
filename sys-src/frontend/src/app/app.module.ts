import {LOCALE_ID, NgModule} from '@angular/core';
import localeDe from '@angular/common/locales/de';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChartOverviewInfectionsComponent} from './components/chart-overview-infections/chart-overview-infections.component';
import {ChartOverviewVaccinationComponent} from './components/chart-overview-vaccination/chart-overview-vaccination.component';
import {AreaChartComponent} from './components/charts/area-chart/area-chart.component';
import {BarChartComponent} from './components/charts/bar-chart/bar-chart.component';
import {PieChartComponent} from './components/charts/pie-chart/pie-chart.component';
import {FooterComponent} from './components/footer/footer.component';
import {InfoBadgesComponent} from './components/info-badges/info-badges.component';
import {InfoTableComponent} from './components/info-table/info-table.component';
import {MapComponent} from './components/map/map.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {VaccineProgressBarComponent} from './components/vaccine-progress-bar/vaccine-progress-bar.component';
import {InfectionsComponent} from './pages/infections/infections.component';
import {ShareComponent} from './pages/share/share.component';
import {VaccinationsComponent} from './pages/vaccinations/vaccinations.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {OrderModule} from "ngx-order-pipe";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {registerLocaleData} from "@angular/common";

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    ChartOverviewInfectionsComponent,
    ChartOverviewVaccinationComponent,
    AreaChartComponent,
    BarChartComponent,
    PieChartComponent,
    FooterComponent,
    InfoBadgesComponent,
    InfoTableComponent,
    MapComponent,
    NavBarComponent,
    VaccineProgressBarComponent,
    InfectionsComponent,
    ShareComponent,
    VaccinationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    OrderModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'de'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
