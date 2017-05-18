import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { AlertModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    CommonModule, AlertModule.forRoot()
  ],
  declarations: [AlertsComponent],
  exports: [AlertsComponent]
})
export class AlertsModule {
}
