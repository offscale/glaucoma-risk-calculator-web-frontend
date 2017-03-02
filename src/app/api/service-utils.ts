import { Response } from '@angular/http';
import { Observable } from 'rxjs';

export interface IStatusBody {
  body: string;
  status: number;
  readonly _resp: Response;
  readonly _parsed: JSON | string | { error: string, error_message: string } | any;
}

export const handleError = (error: Response | any) => {
  if (!(error instanceof Response))
    throw TypeError(`error ${error} can't be handled as it's not Response type, it is: ${typeof error}`);

  const body = error.json() || error.text();
  return Observable.throw({
    body: body.error && body.error_message ?
      `${error.status} - ${body.error}: ${body.error_message}` : `${error.status} - ${error}`,
    status: error.status, _resp: error, _parsed: body
  });
};

export const subHandleError = (error: Response | IStatusBody | Error | any) => {
  this.alertsService.alerts.push({
    type: 'danger',
    msg: error.message ? (error.message.startsWith('JSON.parse') ? 'API offline' : error.message) : error.body
  })
};
