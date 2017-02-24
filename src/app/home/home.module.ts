import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { AlertsModule } from '../alerts/alerts.module';
import { RiskQuizModule } from '../risk-quiz/risk-quiz.module';
import { homeRoutes } from './home.routes';


@NgModule({
  imports: [CommonModule, RouterModule.forChild(homeRoutes), SidebarModule, AlertsModule, RiskQuizModule],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule {
}
