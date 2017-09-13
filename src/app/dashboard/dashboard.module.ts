import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@NgModule({
  imports: [
    CommonModule, UsersModule, EmailModule,
    RouterModule, RouterModule.forChild(dashboardRoutes)
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
