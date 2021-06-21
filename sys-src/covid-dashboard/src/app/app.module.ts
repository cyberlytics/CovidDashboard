import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { InfoBadgesComponent } from './components/info-badges/info-badges.component';

import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { InfoTableComponent } from './components/info-table/info-table.component';
import { HttpClientModule } from '@angular/common/http';
import { VaccineProgressBarComponent } from './components/vaccine-progress-bar/vaccine-progress-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VaccinationsComponent } from './pages/vaccinations/vaccinations.component';
import { InfectionsComponent } from './pages/infections/infections.component';
import { FormsModule } from '@angular/forms';
import { AreaChartComponent } from './components/charts/area-chart/area-chart.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { ChartOverviewVaccinationComponent } from './components/chart-overview-vaccination/chart-overview-vaccination.component';
import { ChartOverviewInfectionsComponent } from './components/chart-overview-infections/chart-overview-infections.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { ShareComponent } from './pages/share/share.component';

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
    VaccinationsComponent,
    InfectionsComponent,
    AreaChartComponent,
    BarChartComponent,
    PieChartComponent,
    ChartOverviewVaccinationComponent,
    ChartOverviewInfectionsComponent,
    ShareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    Ng2OrderModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
