import { Injectable } from '@angular/core';

import { IAlert } from './alert';
import { AppService } from '../app.service';

@Injectable()
export class AlertsService {
  public alerts: Array<IAlert> = [];
  private readonly _padding = 4.5;

  constructor(public appService: AppService) {
  }

  public add(alert: IAlert): void {
    this.alerts.push(alert);
    this.appService.navbarPadding += this._padding;
  }

  public close(i: number): void {
    this.alerts.splice(i, 1);
    this.appService.navbarPadding -= this._padding;
  }
}
