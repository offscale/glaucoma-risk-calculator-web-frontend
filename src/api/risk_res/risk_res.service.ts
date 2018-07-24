import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IRiskQuiz } from '../../app/risk-quiz-form/risk-quiz.model';
import { IRiskRes, IRiskResBase } from './risk_res';
import { map } from 'rxjs/operators';

export type TSingleSeries = Array<{name: string, value: number}>;

@Injectable()
export class RiskResService {
  public risk;
  public id;

  constructor(private http: HttpClient) {
  }

  create(risk_res: IRiskQuiz): Observable<IRiskRes> {
    return this.http.post<IRiskRes>('/api/risk_res', risk_res);
  }

  read(id: number | 'latest'): Observable<IRiskRes> {
    return this.http.get<IRiskRes>(`/api/risk_res/${id}`);
  }

  readAll(): Observable<{risk_res: IRiskRes[], ethnicity_agg: TSingleSeries}> {
    return this.http.get<{risk_res: IRiskRes[], ethnicity_agg: Array<{ethnicity: string, count: number}>}>('/api/risk_res')
      .pipe(map(r => ({
        ethnicity_agg: r.ethnicity_agg.map(
          el => ({ name: el.ethnicity, value: el.count })
        ) as TSingleSeries,
        risk_res: r.risk_res
      })));
  }

  update(id: number | 'latest', newRecord: IRiskResBase): Observable<IRiskRes> {
    return this.http.put<IRiskRes>(`/api/risk_res/${id}`, newRecord);
  }

  destroy(id: number | 'latest'): Observable<{}> {
    return this.http.delete<IRiskRes>(`/api/risk_res/${id}`);
  }
}
