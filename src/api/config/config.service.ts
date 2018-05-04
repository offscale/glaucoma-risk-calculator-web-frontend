import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IConfig, IConfigBase } from './config.interfaces';


@Injectable()
export class ConfigService {
  public config: IConfig;  // silly cache

  constructor(private http: HttpClient) {
  }

  public get(): Observable<IConfig> {
    return this.config ? Observable.of(this.config) :
      this.http.get<IConfig>('/api/config')
        .map(config => this.config = config)
  }

  public post(conf: IConfigBase): Observable<IConfig> {
    return this.http.post<IConfig>('/api/config', conf)
      .map(config => this.config = config);
  }
}
