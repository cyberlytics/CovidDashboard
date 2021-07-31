/* eslint-disable @typescript-eslint/consistent-type-imports */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfectionsComponent} from "./pages/infections/infections.component";
import {VaccinationsComponent} from "./pages/vaccinations/vaccinations.component";
import {ShareComponent} from "./pages/share/share.component";
import {ImprintComponent} from "./pages/imprint/imprint.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'infections'},
  {path: 'infections', component: InfectionsComponent},
  {path: 'vaccinations', component: VaccinationsComponent},
  {path: 'share/:id', component: ShareComponent},
  {path: 'imprint', component: ImprintComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'infections'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
