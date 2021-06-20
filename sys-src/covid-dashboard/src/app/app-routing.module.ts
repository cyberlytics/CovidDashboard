import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfectionsComponent} from './pages/infections/infections.component';
import {VaccinationsComponent} from './pages/vaccinations/vaccinations.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'infections'},
  {path: 'infections', component: InfectionsComponent},
  {path: 'vaccinations', component: VaccinationsComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'infections'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
