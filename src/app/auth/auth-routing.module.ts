import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';
import { authPageGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    canMatch: [authPageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
