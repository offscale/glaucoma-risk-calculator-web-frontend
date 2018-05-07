import { AfterViewInit, Component } from '@angular/core';

import { AlertsService } from '../alerts/alerts.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements AfterViewInit {
  error: string;

  constructor(private alertsService: AlertsService) {}

  ngAfterViewInit() {
    if (!this.alertsService.alerts || !this.alertsService.alerts.length)
      return;
    const alert: {msg: string} = this.alertsService.alerts[this.alertsService.alerts.length - 1] as any;
    if (alert.msg && alert.msg.length && alert.msg.indexOf('interaction_required') > -1)
      this.error = alert.msg;
  }
}
