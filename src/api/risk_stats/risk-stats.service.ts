import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IRiskJson } from 'glaucoma-risk-calculator-engine';

import { AuthService } from '../auth/auth.service';
import { IRiskStats, IRiskStatsBase } from './risk-stats';


@Injectable()
export class RiskStatsService {
  public risk_json: IRiskJson;
  public risk;

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  create(risk_stats: IRiskStatsBase): Observable<IRiskStats> {
    return this.http.post<IRiskStats>('/api/risk_stats', risk_stats);
  }

  read(createdAt: string | 'latest' | Date): Observable<IRiskStats> {
    return this.http.get<IRiskStats>(`/api/risk_stats/${createdAt}`);
  }

  update(prevRecord: IRiskStats, newRecord: IRiskStatsBase): Observable<IRiskStats> {
    return this.http.put<IRiskStats>(`/api/risk_stats/${prevRecord.createdAt}`, newRecord);
  }

  destroy(createdAt: string | Date): Observable<{}> {
    return this.http.delete<{}>(`/api/risk_stats/${createdAt}`);
  }
}
