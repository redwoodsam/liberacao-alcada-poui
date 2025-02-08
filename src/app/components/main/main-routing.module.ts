import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAIN_ROUTES } from './main-routes';


@NgModule({
  // imports: [RouterModule.forRoot(MAIN_ROUTES)],
  imports: [RouterModule.forChild(MAIN_ROUTES)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
