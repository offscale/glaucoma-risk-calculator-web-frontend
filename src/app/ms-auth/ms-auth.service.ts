import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

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
  private _access_token: string;

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

  static paramsToObject(params: HttpParams): {} {
    const o = {};
    for (const key of params.keys())
      o[key] = params.get(key);
    console.info('paramsToObject::params:', params, ';\ntoObject:', o, ';');
    return o;
  }

  constructor(private http: HttpClient,
              private configService: ConfigService) {
    this.params = parseQueryString(location.hash);
    this.init();
  }

  public get access_token(): string {
    if (!this._access_token) this._access_token = localStorage.getItem('ms-access-token');
    return this._access_token;
  }

  public set access_token(val: string) {
    this._access_token = val;
    localStorage.setItem('ms-access-token', val);
  }

  public init() {
    this.configService.get().subscribe(() => {});
  }

  public login(token_type: 'refresh_token' | 'code' | 'access_token', token?: string, state?: string) {
    // check for id_token or access_token in url
    /* tslint:disable:no-console */
    console.info('MsAuthService::login::params[\'id_token\'] =', this.params['id_token'], ';');
    console.info('MsAuthService::login::params[\'access_token\'] =', this.params['access_token'], ';');

    if (token_type != null)
      switch (token_type) {
        case 'code':
          if (token == null) this.msAuthRedir(this.getCode(state));
          localStorage.setItem('ms-code', token);
          this.login('refresh_token', void 0, state);
          break;
        case 'access_token':
          if (token == null) this.msAuthRedir(this.getAccessToken(state));
          else {
            this.access_token = this.params['access_token'] = token;
            localStorage.setItem('ms-access-token', this.access_token);
          }
          break;
        case 'refresh_token':
          if (token == null) this.msAuthRedir(this.getRefreshToken());
          localStorage.setItem('ms-refresh-token', token);
          this.login( 'access_token', void 0, state);
      }
  }

  private msAuthRedir(params) {
    console.info('MsAuthService::getTokenParams() =', this.getTokenParams(), ';');
    console.info('MsAuthService::msAuthRedir::params', params, ';');
    window.location.href = `https://login.microsoftonline.com/${this.configService.config.tenant_id}/oauth2/authorize?${params}`;
  }

  public logout() {
    localStorage.removeItem('ms-access-token');
    this._access_token = null;
  }

  public getAccessToken(state?: string): HttpParams {
    // redirect to get access_token

    const params = new HttpParams({ fromObject: MsAuthService.paramsToObject(this.getTokenParams(state)) })
      .set('response_type', 'token')
      .set('resource', 'https://graph.microsoft.com')
      .set('prompt', 'none');
    console.info('MsAuthService::getAccessToken::params', params, ';');
    return params;
  }

  public getCode(state?: string): HttpParams {
    // https://github.com/microsoftgraph/microsoft-graph-docs/blob/master/concepts/auth_v2_user.md#authorization-request

    const default_params = MsAuthService.paramsToObject(this.getTokenParams(state));
    const params = new HttpParams({
      fromObject:
        Object
          .keys(default_params)
          .filter(k => ['client_id', 'response_type', 'redirect_uri', 'scope', 'response_mode', 'state'].indexOf(k) > -1)
          .reduce((a, b) => Object.assign(a, { [b]: default_params[b] }), {})
    })
      .set('response_type', 'code');
    console.info('MsAuthService::getCode::params', params, ';');
    return params;
  }

  public getRefreshToken(state?: string): HttpParams {
    // https://github.com/microsoftgraph/microsoft-graph-docs/blob/master/concepts/auth_v2_user.md#token-request

    const default_params = MsAuthService.paramsToObject(this.getTokenParams(state));
    const params = new HttpParams({
      fromObject:
        Object
          .keys(default_params)
          .filter(k => ['client_id', 'grant_type', 'scope', 'code', 'redirect_uri', 'client_secret'].indexOf(k) > -1)
          .reduce((a, b) => Object.assign(a, { [b]: default_params[b] }), {})
    })
      .set('grant_type', 'authorization_code')
      .set('scope', 'https://graph.microsoft.com/mail.send https://graph.microsoft.com/offline_access')
      // .set('resource', 'https://graph.microsoft.com')
      // .set('prompt', 'none')
      .set('code', localStorage.getItem('ms-code'))
      .set('client_secret', this.configService.config.client_secret);
    // .set('response_type', 'code');

    console.info('MsAuthService::getRefreshToken::params', params, ';');
    return params;
  }

  private getTokenParams(state?: string): HttpParams {
    /* tslint:disable:no-console */
    console.info('MsAuthService::getTokenParams::client_id =', this.configService.config.client_id, ';');

    return new HttpParams()
      .set('client_id', this.configService.config.client_id)
      .set('redirect_uri', MsAuthService.getHostOrigin())
      .set('state', state || window.location.pathname) // redirect_uri doesn't work with angular for some reason?
      .set('nonce', MsAuthService.genNonce());
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
}
