import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IRiskRes, IRiskResBase } from './risk_res';
import { map } from 'rxjs/operators';

import { IRiskQuiz } from '../../app/quiz/risk-quiz.model';

export type TSingleSeries = Array<{name: string, value: number}>;

@Injectable()
export class RiskResService {
  public risk: IRiskRes;
  public id: number;

  constructor(private http: HttpClient) {
  }

  create(riskRes: IRiskQuiz): Observable<IRiskRes> {
    return this.http.post<IRiskRes>('/api/risk_res', riskRes);
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
