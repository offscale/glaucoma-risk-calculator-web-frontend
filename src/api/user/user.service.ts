import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { IAuthReq } from '../auth/auth.interfaces';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  post(user: IAuthReq): Observable<IAuthReq> {
    return this.http.post<IAuthReq>('/api/user', JSON.stringify(user))
  }

  getAll(): Observable<{users: IAuthReq[]}> {
    return this.http.get<{users: IAuthReq[]}>('/api/users');
  }
}
