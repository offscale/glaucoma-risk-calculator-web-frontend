import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
import { RiskResModule } from '../risk-res/risk-res.module';

@NgModule({
  imports: [
    CommonModule, UsersModule, EmailModule, RiskResModule,
    RouterModule, RouterModule.forChild(dashboardRoutes)
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
