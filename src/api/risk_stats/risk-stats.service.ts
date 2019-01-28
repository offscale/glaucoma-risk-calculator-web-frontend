import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { IRiskJson } from 'glaucoma-risk-calculator-engine';

import { AuthService } from '../auth/auth.service';
import { IRiskStats, IRiskStatsBase } from './risk-stats';
import { map } from 'rxjs/operators';


@Injectable()
export class RiskStatsService {
  public risk_json: IRiskJson;
  public risk: number;

  constructor(private authService: AuthService,
              private http: HttpClient) {}

  create(risk_stats: IRiskStatsBase): Observable<IRiskStats> {
    return this.http.post<IRiskStats>('/api/risk_stats', risk_stats);
  }

  read(createdAt: string | 'latest' | Date): Observable<IRiskStats> {
    const cache = localStorage.getItem('risk_stats_timestamp');

    if (cache != null) {
      const elapsed = new Date().getTime() - new Date(cache).getTime();

      if (elapsed > 24 * 60 * 60 * 1000) /* oneDay */ {
        localStorage.removeItem('risk_stats_timestamp');
        localStorage.removeItem('risk_stats');
      } else {
        return of(JSON.parse(localStorage.getItem('risk_stats') as string) as IRiskStats);
      }
    }

    return this.http
      .get<IRiskStats>(`/api/risk_stats/${createdAt}`)
      .pipe(map(risk_stats_json => {
        localStorage.setItem('risk_stats_timestamp', new Date().toISOString());
        localStorage.setItem('risk_stats', JSON.stringify(risk_stats_json));
        return risk_stats_json;
      }));
  }

  update(prevRecord: IRiskStats, newRecord: IRiskStatsBase): Observable<IRiskStats> {
    return this.http.put<IRiskStats>(`/api/risk_stats/${prevRecord.createdAt}`, newRecord);
  }

  destroy(createdAt: string | Date): Observable<{}> {
    return this.http.delete<{}>(`/api/risk_stats/${createdAt}`);
  }
}
