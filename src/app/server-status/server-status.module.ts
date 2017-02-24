import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerStatusService } from '../api/server-status.service';
import { ServerStatusComponent } from './server-status.component';

@NgModule({
  imports: [CommonModule],
  providers: [ServerStatusService],
  declarations: [ServerStatusComponent],
  exports: [ServerStatusComponent]
})

export class ServerStatusModule {
}
