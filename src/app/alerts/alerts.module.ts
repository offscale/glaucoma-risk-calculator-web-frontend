import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertsComponent } from './alerts.component';
import { AlertsService } from './alerts.service';

@NgModule({
  imports: [
    CommonModule, NgbAlertModule.forRoot()
  ],
  declarations: [AlertsComponent],
  exports: [AlertsComponent]
})
export class AlertsModule {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: AlertsModule, providers: [AlertsService] };
  }
}
