import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { ConfigService } from '../../api/config/config.service';


interface ArrayBufferViewForEach extends ArrayBufferView {
  forEach(callbackfn: (value: number, index: number, array: Int8Array) => void, thisArg?: any): void;
}

// old endpoint
interface ResHash {
  id_token?: string;
  access_token?: string;
  state: string;
  session_state: string;
}

interface IUrlParams {
  url: string;
  params: HttpParams;
}

// new endpoint: https://github.com/microsoftgraph/microsoft-graph-docs/blob/master/concepts/auth_v2_user.md#token-response
interface ITokenResponse {
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
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
    /* tslint:disable:no-console */
    console.info('paramsToObject::params:', params, ';\ntoObject:', o, ';');
    return o;
  }

  private msAuthRedir(url_params: IUrlParams) {
    console.info('MsAuthService::getTokenParams() =', this.getTokenParams(), ';');
    console.info('MsAuthService::msAuthRedir::params', url_params.params, ';');
    window.location.href = `${url_params.url}${url_params.params}`;
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

  constructor(private http: HttpClient,
              private router: Router,
              private configService: ConfigService) {
    this.params = parseQueryString(location.hash);
    this.init();
  }

  public login(token_type: 'refresh_token' | 'code' | 'access_token',
               token?: string, state?: string) {
    if (token_type == null) return;

    this.params[token_type] = token;

    /* tslint:disable:no-console */
    console.info('MsAuthService::login::params =', this.params, ';');
    console.info('MsAuthService::login::token_type', token_type, ';');
    console.info('MsAuthService::login::token:', token, 'of type', typeof token, ';');

    switch (token_type) {
      case 'code':
        if (token == null || token === 'undefined') this.msAuthRedir(this.getCode(state));
        localStorage.setItem(`ms::${token_type}`, token);
        this.login('refresh_token', void 0, state);
        break;
      case 'access_token':
      case 'refresh_token':
        if (token == null || token === 'undefined')
          this.getTokens().subscribe(
            tokens =>
              Object.keys(tokens).forEach(key =>
                localStorage.setItem(`ms::#${key}`, tokens[key])
              ),
            console.error.bind(console)
          );
    }

    this.router.navigateByUrl(state == null ? '/' : decodeURIComponent(state));
  }

  public logout() {
    Object
      .keys(localStorage)
      .forEach(key => key.startsWith('ms::') && localStorage.removeItem(key));
  }

  public init() {
    this.configService.get().subscribe(() => {});
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
        'Authorization': `Bearer ${this.configService.config.access_token}`
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
          this.login('code');
        return Observable.throw(err);
      });
  }

  public getCode(state?: string): IUrlParams {
    // https://github.com/microsoftgraph/microsoft-graph-docs/blob/master/concepts/auth_v2_user.md#authorization-request

    /*
    // After redirect, successful response is:
    interface ICodeResponse {
      code: string;
      state: string;
    }
    */

    const default_params = MsAuthService.paramsToObject(this.getTokenParams(state));
    const params = new HttpParams({
      fromObject:
        Object
          .keys(default_params)
          .filter(k => [
            'client_id', 'response_type', 'redirect_uri', 'response_mode', 'scope', 'state'
          ].indexOf(k) > -1)
          .reduce((a, b) => Object.assign(a, { [b]: default_params[b] }), {})
    })
      .set('response_type', 'code')
      .set('response_mode', 'query')
      .set('scope', 'offline_access mail.send');
    console.info('MsAuthService::getCode::params', params, ';');
    return { params, url: `https://login.microsoftonline.com/${this.configService.config.tenant_id}/oauth2/v2.0/authorize?` };
  }

  public getTokens(state?: string): Observable<ITokenResponse> {
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
      .set('code', localStorage.getItem('ms::code'))
      .set('client_secret', this.configService.config.client_secret);
    console.info('MsAuthService::getTokens::params', params, ';');

    return this.http
      .post<ITokenResponse>(
        `https://login.microsoftonline.com/${this.configService.config.tenant_id}/oauth2/v2.0/token`,
        MsAuthService.paramsToObject(params)
      );
  }

  /*
  public getAccessToken(state?: string): HttpParams {
    // redirect to get access_token

    const params = new HttpParams({ fromObject: MsAuthService.paramsToObject(this.getTokenParams(state)) })
      .set('response_type', 'token')
      .set('resource', 'https://graph.microsoft.com')
      .set('prompt', 'none');
    console.info('MsAuthService::getAccessToken::params', params, ';');
    return params;
  }
  */

  public remoteSendEmail(risk_id: number, mail: IMail): Observable<IMail> {
    return this.http
      .post<IMail>(`/api/email/${mail.recipient}/${risk_id}`, void 0);
  }
}
