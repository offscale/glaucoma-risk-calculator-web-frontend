import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { IConfig, IConfigBase } from './config.interfaces';
import { map } from 'rxjs/operators';


@Injectable()
export class ConfigService {
  public config: IConfig;  // silly cache

  constructor(private http: HttpClient) {
  }

  public get(): Observable<IConfig> {
    return this.config ? of(this.config) :
      this.http.get<IConfig>('/api/config')
        .pipe(map(config => this.config = config));
  }

  public post(conf: IConfigBase): Observable<IConfig> {
    return this.http.post<IConfig>('/api/config', conf)
      .pipe(map(config => this.config = config));
  }
}
