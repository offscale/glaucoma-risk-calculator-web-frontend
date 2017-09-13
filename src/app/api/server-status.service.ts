import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ServerStatus } from './ServerStatus';


@Injectable()
export class ServerStatusService {
  constructor(private http: Http) {
  }

  get(): Observable<ServerStatus> {
    return this.http
      .get('/api')
      .map((r: Response) => r.json() as ServerStatus)
  }
}
