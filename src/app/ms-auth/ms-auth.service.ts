import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpParams } from '@angular/common/http/src/params';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { ConfigService } from '../../api/config/config.service';

interface ArrayBufferViewForEach extends ArrayBufferView {
  forEach(callbackfn: (value: number, index: number, array: Int8Array) => void, thisArg?: any): void;
}

interface ResHash {
  id_token?: string;
  access_token?: string;
  state: string;
  session_state: string;
}

export interface IMail {
  recipient: string;
  subject: string;
  content: string;
}

// https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols-oauth-code#successful-response-1
export interface IMSRefreshResponse {
  access_token: string;
  token_type: 'Bearer' | string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  id_token: string;
}

export const parseQueryString = (url: string): ResHash => {
  const params: ResHash = {} as ResHash;
  const regex = /([^&=]+)=([^&]*)/g;
  let m: RegExpExecArray;
  while (m = regex.exec(url)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return params;
};

@Injectable()
export class MsAuthService {
  private params: ResHash;

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.params = parseQueryString(location.hash);
  }

  private _tenant_id: string;

  get tenant_id(): string {
    if (!this._tenant_id) throw TypeError('tenant_id must be defined. Did you run MsAuthService.setup?');
    return this._tenant_id;
  }

  set tenant_id(val: string) {
    this._tenant_id = val;
  }

  private _client_id: string;

  get client_id(): string {
    if (!this._client_id) throw TypeError('client_id must be defined. Did you run MsAuthService.setup?');
    return this._client_id;
  }

  set client_id(val: string) {
    this._client_id = val;
  }

  private _access_token: string;

  get access_token(): string {
    if (!this._access_token) this._access_token = localStorage.getItem('ms-access-token');
    return this._access_token;
  }

  set access_token(val: string) {
    this._access_token = val;
    localStorage.setItem('ms-access-token', val);
  }

  static genNonce() {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz'; // '-._~';
    const rands = new Uint8Array(32);
    const results = [];
    window.crypto.getRandomValues(rands);
    rands.forEach(c => results.push(charset[c % charset.length]));
    return results.join('');
  }

  static getHostOrigin(): string {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ?
      ':' + window.location.port : ''}`;
  }

  setup(tenant_id: string, client_id: string) {
    this.tenant_id = tenant_id;
    this.client_id = client_id;
  }

  login() {
    // check for id_token or access_token in url
    /* tslint:disable:no-console */
    console.info('this.params[\'id_token\'] =', this.params['id_token']);
    console.info('this.params[\'access_token\'] =', this.params['access_token']);
    if (this.params['id_token'] !== null)
      this.getAccessToken();
    else if (this.params['access_token'] !== null)
      this.access_token = this.params['access_token'];

    // redirect to get id_token
    console.info('MsAuthService::getAccessTokenParams() =', this.getAccessTokenParams());

    const params = new HttpParams();
    params.set('response_type', 'id_token');
    params.appendAll(this.getAccessTokenParams());
    window.location.href = `https://login.microsoftonline.com/${this.tenant_id}/oauth2/authorize?${params}`;
  }

  logout() {
    localStorage.removeItem('ms-access-token');
    this._access_token = null;
  }

  public getAccessToken(state?: string) {
    // redirect to get access_token
    const params = new HttpParams();
    params.set('response_type', 'token');
    params.appendAll(this.getAccessTokenParams(state));
    params.set('resource', 'https://graph.microsoft.com');
    params.set('prompt', 'none');
    window.location.href = `https://login.microsoftonline.com/${this.tenant_id}/oauth2/authorize?${params}`;
  }

  public getRefreshToken(state?: string) {
    // redirect to get refresh_token
    /*
    const params = new HttpParams();
    params.appendAll(this.getAccessTokenParams(state));
    params.set('resource', 'https://graph.microsoft.com');
    params.set('prompt', 'none');
    */
    window.location.href = `https://login.microsoftonline.com/${this.tenant_id}/oauth2/authorize?${this.getRefreshTokenParams(state)}`;
  }

  public remoteSendEmail(risk_id: number, mail: IMail): Observable<IMail> {
    return this.http
      .post<IMail>(`/api/email/${mail.recipient}/${risk_id}`, void 0);
  }

  public localSendEmail(mail: IMail): Observable<IMail> {
    const httpOptions: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      observe: 'response';
      params?: HttpParams | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.access_token}`
      }),
      observe: 'response'
    };

    const body = {
      message: {
        subject: mail.subject,
        toRecipients: [{
          emailAddress: {
            address: mail.recipient
          }
        }],
        body: {
          content: mail.content,
          contentType: 'html'
        }
      }
    };
    return this.http
      .post<IMSRefreshResponse>('https://graph.microsoft.com/v1.0/users/me/sendMail', body, httpOptions)
      .map((response: HttpResponse<IMSRefreshResponse>) => {
        if (response.status !== 202)
          Observable.throw(new Error(`Expected response.status of 202 got ${response.status}.
           Body: ${response.body}`));
        return response.body;
      })
      .catch(error => {
        const err = JSON.parse(error._body).error;
        if (err.message === 'Access token has expired.')
          this.getAccessToken();
        return Observable.throw(err);
      });
  }


  private getAccessTokenParams(state?: string): HttpParams {
    const params: HttpParams = new HttpParams();
    params.set('client_id', this.client_id);
    /* tslint:disable:no-console */
    console.info('getAccessTokenParams::client_id =', this.client_id);
    params.set('redirect_uri', MsAuthService.getHostOrigin());
    params.set('state', state || window.location.pathname); // redirect_uri doesn't work with angular for some reason?
    params.set('nonce', MsAuthService.genNonce());
    return params;
  }

  private getRefreshTokenParams(state?: string): HttpParams {
    const params: HttpParams = new HttpParams();
    params.set('client_id', this.client_id);
    /* tslint:disable:no-console */
    console.info('getRefreshTokenParams::client_id =', this.client_id);
    params.set('redirect_uri', MsAuthService.getHostOrigin());
    params.set('state', state || window.location.pathname); // redirect_uri doesn't work with angular for some reason?
    // params.set('nonce', MsAuthService.genNonce());
    params.set('grant_type', 'authorization_code');
    return params;
  }
}
