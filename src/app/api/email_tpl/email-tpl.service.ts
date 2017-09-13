import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IEmailTpl, IEmailTplBase } from './email-tpl.d';
import { handleError } from '../service-utils';
import { AssertionError } from 'assert';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class EmailTplService {
  public email_tpl: IEmailTplBase;
  private req_options: RequestOptions;

  constructor(private authService: AuthService,
              private http: Http) {}

  public hasTpl(): boolean {
    return !!this.email_tpl && Object.keys(this.email_tpl).length > 0 && !!this.email_tpl.tpl;
  }

  public setTpl(tpl: string) {
    this.hasTpl() ?
      this.email_tpl.tpl = tpl
      : this.email_tpl = { tpl: tpl, createdAt: new Date().toISOString() }
  }

  create(email_tpl: IEmailTplBase): Observable<IEmailTpl> {
    this.setReqOptions();
    return this.http
      .post('/api/email_tpl', JSON.stringify(email_tpl), this.req_options)
      .map((r: Response) => r.json() as IEmailTpl)
      .catch(handleError)
  }

  read(createdAt: string | 'latest' | Date): Observable<IEmailTpl> {
    this.setReqOptions();
    return this.http
      .get(`/api/email_tpl/${createdAt}`, this.req_options)
      .map((r: Response) => r.json() as IEmailTpl)
      .catch(handleError)
  }

  update(prevRecord: IEmailTpl, newRecord: IEmailTplBase): Observable<IEmailTpl> {
    this.setReqOptions();
    return this.http
      .put(`/api/email_tpl/${prevRecord.createdAt}`, JSON.stringify(newRecord), this.req_options)
      .map((r: Response) => r.json() as IEmailTpl)
      .catch(handleError)
  }

  destroy(createdAt: string | Date): Observable<{}> {
    this.setReqOptions();
    return this.http
      .delete(`/api/email_tpl/${createdAt}`, this.req_options)
      .map((r: Response) => r.status === 204 ? Object.freeze({}) : Observable.throw(
        new AssertionError({ message: `Expected status of 204, got ${r.status}` })))
      .catch(handleError)
  }

  private setReqOptions() {
    this.req_options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Access-Token': this.authService.accessToken
      })
    });
  }
}
