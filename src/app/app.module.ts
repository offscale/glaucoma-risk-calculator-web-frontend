import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AlertsModule } from './alerts/alerts.module';
import { NavbarModule } from './navbar/navbar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { FooterModule } from './footer/footer.module';
import { RiskQuizFormModule } from './risk-quiz-form/risk-quiz-form.module';

import { AuthService } from '../api/auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptors';
import { AuthModule } from './auth/auth.module';

import { rootRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

@NgModule({
  imports: [
    RouterModule, RouterModule.forRoot(rootRoutes),
    BrowserModule, HttpClientModule, FormsModule,
    NavbarModule, FooterModule, UsersModule,
    EmailModule, AlertsModule.forRoot(),
    RiskQuizFormModule, AuthModule, DashboardModule
  ],
  declarations: [AppComponent],
  providers: [
    AppService, AuthService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
