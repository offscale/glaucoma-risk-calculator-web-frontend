import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { IServerStatus } from './server-status.interfaces';

@Injectable()
export class ServerStatusService {
  previousResponse: IServerStatus;

  constructor(private http: HttpClient) { }

  get(): Observable<IServerStatus> {
    return this.previousResponse ? of(this.previousResponse)
      : this.http.get<IServerStatus>('/api');
  }
}
