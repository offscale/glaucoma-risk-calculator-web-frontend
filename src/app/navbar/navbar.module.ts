import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { AlertsModule } from '../alerts/alerts.module';

@NgModule({
  imports: [CommonModule, RouterModule, AlertsModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {
}
