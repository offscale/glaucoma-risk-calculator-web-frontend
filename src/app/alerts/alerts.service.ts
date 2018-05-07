import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { AppService } from '../app.service';
import { IAlert, TAlert } from './alert';

@Injectable()
export class AlertsService {
  public alerts: TAlert[] = [];
  private readonly _padding = 4.5;

  constructor(public appService: AppService) {
  }

  public add(alert: TAlert | string): void {
    if (alert == null) return;
    else if ((alert as IAlert).type && (alert as IAlert).msg)
      this.alerts.push({
        type: (alert as IAlert).type,
        msg: (
          s => typeof s === 'string' ? s
            : `${(s as Response).status}: ${(s as Response).statusText} on ${(s as Response).url}`
        )(
          (alert as IAlert).msg as any as string | object
        )
      });
    else this.alerts.push({
        type: 'warning',
        msg: typeof alert === 'string' ? alert : (alert.hasOwnProperty('error') && alert.hasOwnProperty('error_message') ?
          Object.values(alert).join(': ') : Object
            .keys(alert)
            .map(k => alert[k])
            .join('\t'))
      });
    this.appService.navbarPadding += this._padding;
  }

  public close(i: number): void {
    this.alerts.splice(i, 1);
    this.appService.navbarPadding -= this._padding;
  }
}
