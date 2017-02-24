import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ServerStatus } from './ServerStatus';

@Injectable()
export class ServerStatusService {
  constructor(private http: Http) {
  }

  get(): Promise<ServerStatus> {
    return this.http.get('/api')
      .toPromise()
      .then((r: Response) => r.json() as ServerStatus)
      .catch(console.error)
  }
}
