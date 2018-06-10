import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { IServerStatus } from './server-status.interfaces';

@Injectable()
export class ServerStatusService {
  last_resp: IServerStatus;

  constructor(private http: HttpClient) { }

  get(): Observable<IServerStatus> {
    return this.last_resp ? of(this.last_resp)
      : this.http.get<IServerStatus>('/api');
  }
}
