import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IEmailTpl, IEmailTplBase } from './email-tpl.d';

@Injectable()
export class EmailTplService {
  public email_tpl: IEmailTplBase;  // silly cache

  constructor(private http: HttpClient) {
  }

  public hasTpl(): boolean {
    return !!this.email_tpl && Object.keys(this.email_tpl).length > 0 && !!this.email_tpl.tpl;
  }

  public setTpl(tpl: string) {
    this.hasTpl() ?
      this.email_tpl.tpl = tpl
      : this.email_tpl = { tpl: tpl, createdAt: new Date().toISOString() }
  }

  create(email_tpl: IEmailTplBase): Observable<IEmailTpl> {
    return this.http.post<IEmailTpl>('/api/email_tpl', JSON.stringify(email_tpl));
  }

  read(createdAt: string | 'latest' | Date): Observable<IEmailTpl> {
    return this.http.get<IEmailTpl>(`/api/email_tpl/${createdAt}`)
  }

  update(prevRecord: IEmailTpl, newRecord: IEmailTplBase): Observable<IEmailTpl> {
    return this.http.put<IEmailTpl>(`/api/email_tpl/${prevRecord.createdAt}`, JSON.stringify(newRecord))
  }

  destroy(createdAt: string | Date): Observable<{}> {
    return this.http
      .delete<IEmailTpl>(`/api/email_tpl/${createdAt}`)
  }
}
