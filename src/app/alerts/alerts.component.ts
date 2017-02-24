import { Component, Input, OnInit } from '@angular/core';
import { IAlert } from './alert';
import { AlertsService } from './alerts.service';
import { AlertComponent } from 'ng2-bootstrap';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  providers: [AlertComponent],
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @Input() public type: string = 'warning';
  @Input() public dismissible: boolean;
  @Input() public dismissOnTimeout: number;

  public alerts: Array<IAlert>;

  constructor(private readonly alertsService: AlertsService) {
  }

  ngOnInit() {
    this.alerts = this.alertsService.alerts;
  }

  addAlert(alert: IAlert) {
    this.alertsService.add(alert);
  }

  closeAlert(i: number) {
    this.alertsService.close(i);
  }
}
