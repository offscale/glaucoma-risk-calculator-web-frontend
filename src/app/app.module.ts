import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertsModule } from './alerts/alerts.module';
import { RiskQuizModule } from './risk-quiz/risk-quiz.module';
import { AuthService } from './api/auth/auth.service';
import { AuthGuard } from './api/auth/auth-guard.service';
import { AlertsService } from './alerts/alerts.service';
import { NavbarModule } from './navbar/navbar.module';
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { FooterModule } from './footer/footer.module';
import { rootRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

@NgModule({
  imports: [
    RouterModule, RouterModule.forRoot(rootRoutes),
    BrowserModule, HttpModule, FormsModule,
    FooterModule, HomeModule, UsersModule,
    DashboardModule, EmailModule, AlertsModule,
    RiskQuizModule, NavbarModule],
  declarations: [AppComponent],
  providers: [AuthService, AuthGuard, AlertsService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
