import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServerStatusComponent } from './server-status.component';
import { ServerStatusService } from '../../api/server-status/server-status.service';


@NgModule({
  declarations: [ServerStatusComponent],
  imports: [
    CommonModule
  ],
  providers: [ServerStatusService],
  exports: [ServerStatusComponent]
})
export class ServerStatusModule {}
