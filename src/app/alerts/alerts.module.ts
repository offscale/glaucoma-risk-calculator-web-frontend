import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertModule } from 'ngx-bootstrap';

import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';

@NgModule({
  imports: [
    CommonModule, AlertModule.forRoot()
  ],
  declarations: [AlertsComponent],
  exports: [AlertsComponent]
})
export class AlertsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: AlertModule, providers: [AlertsService] };
  }
}
