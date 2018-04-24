import { Injectable } from '@angular/core';

import { AppService } from '../app.service';
import { TAlert } from './alert';

@Injectable()
export class AlertsService {
  public alerts: TAlert[] = [];
  private readonly _padding = 4.5;

  constructor(public appService: AppService) {
  }

  public add(alert: TAlert | string): void {
    const alert_s = (s => typeof s === 'string' ?
        s : Object.keys(s).map(k => `${k} => ${s[k]}`).join(' ')
    )(alert && (typeof alert === 'string' ? alert
      : (alert instanceof Error ? alert.message : Object
        .keys(alert)
        .map(k => alert[k])
        .join('\t'))) || 'undefined alert');
    console.info('Alert =', alert);
    this.alerts.push({ type: 'warning', msg: alert_s });
    this.appService.navbarPadding += this._padding;
  }

  public close(i: number): void {
    this.alerts.splice(i, 1);
    this.appService.navbarPadding -= this._padding;
  }
}
