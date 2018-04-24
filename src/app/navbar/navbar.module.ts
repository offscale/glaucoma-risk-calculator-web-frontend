import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap'

import { AlertsModule } from '../alerts/alerts.module';
import { NavbarComponent } from './navbar.component';


@NgModule({
  imports: [CommonModule, RouterModule, AlertModule, AlertsModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule {
}
