import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IEmailTplBase } from '../email_tpl/email-tpl';
import { IEmailConf, IEmailConfBase } from './email_conf.interfaces';

@Injectable()
export class EmailConfService {
  public email_tpl: IEmailTplBase;  // silly cache

  constructor(private http: HttpClient) {
  }

  public getConf(): Observable<IEmailConf> {
    return this.http.get<IEmailConf>('/api/email_conf')
  }

  public insertConf(conf: IEmailConfBase): Observable<IEmailConf> {
    return this.http.post<IEmailConf>('/api/email_conf', conf);
  }
}
