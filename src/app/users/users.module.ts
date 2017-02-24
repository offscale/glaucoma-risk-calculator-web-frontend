import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from '../dashboard/dashboard.routes';
import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(dashboardRoutes)
  ],
  declarations: [UsersComponent]
})
export class UsersModule {
}
