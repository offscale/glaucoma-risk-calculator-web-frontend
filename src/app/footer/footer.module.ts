import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer.component';
import { ServerStatusService } from '../api/server-status.service';
import { ServerStatusModule } from '../server-status/server-status.module';


@NgModule({
  imports: [
    CommonModule, ServerStatusModule
  ],
  providers: [ServerStatusService],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {
}
