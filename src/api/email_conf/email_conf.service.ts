import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IEmailConf, IEmailConfBase } from './email_conf.interfaces';


@Injectable()
export class EmailConfService {
  public email_conf: IEmailConf;  // silly cache

  constructor(private http: HttpClient) {
  }

  public get(): Observable<IEmailConf> {
    return this.email_conf ? Observable.of(this.email_conf) :
      this.http.get<IEmailConf>('/api/email_conf')
        .map(email_conf => this.email_conf = email_conf)
  }

  public post(conf: IEmailConfBase): Observable<IEmailConf> {
    return this.http.post<IEmailConf>('/api/email_conf', conf)
      .map(email_conf => this.email_conf = email_conf);
  }
}
