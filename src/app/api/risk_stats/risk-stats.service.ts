import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AssertionError } from 'assert';
import { IRiskJson } from 'glaucoma-risk-calculator-engine';
import { handleError } from '../service-utils';
import { AuthService } from '../auth/auth.service';
import { IRiskStats, IRiskStatsBase } from './risk-stats';


@Injectable()
export class RiskStatsService {
  public risk_stats: IRiskJson;
  public risk;
  private req_options: RequestOptions;

  constructor(private authService: AuthService, private http: Http) {
  }

  create(risk_stats: IRiskStatsBase): Observable<IRiskStats> {
    this.setReqOptions();
    return this.http.post('/api/risk_stats', JSON.stringify(risk_stats), this.req_options)
      .map((r: Response) => r.json() as IRiskStats)
      .catch(handleError)
  }

  read(createdAt: string | 'latest' | Date): Observable<IRiskStats> {
    return this.http.get(`/api/risk_stats/${createdAt}`, new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json'
      })
    }))
      .map((r: Response) => r.json() as IRiskStats)
      .catch(handleError)
  }

  update(prevRecord: IRiskStats, newRecord: IRiskStatsBase): Observable<IRiskStats> {
    this.setReqOptions();
    return this.http.put(`/api/risk_stats/${prevRecord.createdAt}`, JSON.stringify(newRecord), this.req_options)
      .map((r: Response) => r.json() as IRiskStats)
      .catch(handleError)
  }

  destroy(createdAt: string | Date): Observable<{}> {
    this.setReqOptions();
    return this.http.delete(`/api/risk_stats/${createdAt}`, this.req_options)
      .map((r: Response) => r.status === 204 ? Object.freeze({}) : Observable.throw(
        new AssertionError(`Expected status of 204, got ${r.status}`)))
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
