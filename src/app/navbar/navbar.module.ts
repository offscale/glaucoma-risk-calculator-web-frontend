import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertsModule } from '../alerts/alerts.module';
import { NavbarComponent } from './navbar.component';


@NgModule({
  imports: [CommonModule, RouterModule, NgbAlertModule, AlertsModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {
}
