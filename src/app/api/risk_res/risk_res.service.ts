import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AssertionError } from 'assert';
import { IRiskJson } from 'glaucoma-risk-quiz-engine';
import { handleError } from '../service-utils';
import { AuthService } from '../auth/auth.service';
import { IRiskRes, IRiskResBase } from './risk_res';
import { IRiskQuiz } from '../../risk-quiz-form/risk-quiz.model';


@Injectable()
export class RiskResService {
  private req_options: RequestOptions;
  public risk_res: IRiskJson;
  public risk;

  constructor(private authService: AuthService, private http: Http) {
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

  create(risk_res: IRiskQuiz): Observable<IRiskRes> {
    this.setReqOptions();
    return this.http.post('/api/risk_res', JSON.stringify(risk_res), this.req_options)
      .map((r: Response) => r.json() as IRiskRes)
      .catch(handleError)
  }

  read(id: number | 'latest'): Observable<IRiskRes> {
    return this.http.get(`/api/risk_res/${id}`, new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json'
      })
    }))
      .map((r: Response) => r.json() as IRiskRes)
      .catch(handleError)
  }

  update(id: number | 'latest', newRecord: IRiskResBase): Observable<IRiskRes> {
    this.setReqOptions();
    return this.http.put(`/api/risk_res/${id}`, JSON.stringify(newRecord), this.req_options)
      .map((r: Response) => r.json() as IRiskRes)
      .catch(handleError)
  }

  destroy(id: number | 'latest'): Observable<{}> {
    this.setReqOptions();
    return this.http.delete(`/api/risk_res/${id}`, this.req_options)
      .map((r: Response) => r.status === 204 ? Object.freeze({}) : Observable.throw(
        new AssertionError(`Expected status of 204, got ${r.status}`)))
      .catch(handleError)
  }
}
