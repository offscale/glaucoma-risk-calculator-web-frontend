import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ServerStatusService } from '../../api/server-status/server-status.service';
import { ServerStatusModule } from '../server-status/server-status.module';
import { FooterComponent } from './footer.component';


@NgModule({
  imports: [
    CommonModule, RouterModule, ServerStatusModule
  ],
  providers: [ServerStatusService],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {
}
