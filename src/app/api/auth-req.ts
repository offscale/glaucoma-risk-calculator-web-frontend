/*import { Injectable } from '@angular/core';
 import { Observable, Subscription } from 'rxjs';
 import { Headers, Http, Request, RequestMethod, RequestOptions, URLSearchParams } from '@angular/http';
 import { Router } from '@angular/router';

 @Injectable()
 export class AuthReqService {
 private baseUrl: string;
 private subscription: Subscription;
 private token: TokenModel;

 constructor(public tokenService: TokenService,
 public http: Http,
 public router: Router) {
 this.baseUrl = `${process.env.API_URL}/example`;
 this.subscription = this.tokenService.token$.subscribe(token => this.token = token);
 }

 get(path: string, params?: Object, withCredentials?: boolean): Observable<any> {
 this.checkAuthorised();

 const url: string = this.baseUrl + path;
 const headers: Headers = new Headers({
 'Accept': 'application/json'
 });

 const searchParams = new URLSearchParams(`user_session=${this.token.token}`);

 for (let param in params) searchParams.set(param, params[param]);

 const options: RequestOptions = new RequestOptions({
 url: url,
 method: RequestMethod.Get,
 headers: headers,
 search: searchParams,
 withCredentials: withCredentials
 });

 const request = new Request(options);

 return this.makeRequest(request);
 }

 post(path: string, body?: Object, params?: Object, useDataProperty?: boolean, withCredentials?: boolean): Observable<any> {
 this.checkAuthorised();

 const url: string = this.baseUrl + path;

 const headers: Headers = new Headers({
 'Accept': 'application/json',
 'Content-Type': 'application/json',
 });

 const data = JSON.stringify(useDataProperty ? {data: body} : body);

 const searchParams = new URLSearchParams(`user_session=${this.token.token}`);

 for (let param in params) searchParams.set(param, params[param]);

 const options: RequestOptions = new RequestOptions({
 url: url,
 method: RequestMethod.Post,
 headers: headers,
 body: data,
 search: searchParams,
 withCredentials: withCredentials
 });

 const request = new Request(options);

 return this.makeRequest(request);
 }

 makeRequest(request: Request) {
 return this.intercept(this.http.request(request).map(res => res.json()));
 }

 intercept(observable: Observable<any>) {
 return observable.catch(err => {

 if (err.status === 401) {
 return this.unauthorised();

 } else if (err.status === 403) {
 return this.forbidden();
 } else {
 return Observable.throw(err);
 }
 });
 }

 unauthorised(): Observable<any> {
 this.tokenService.clear();
 this.router.navigate(['/login']);
 return Observable.empty();
 }

 forbidden(): Observable<any> {
 this.router.navigate(['/']);
 return Observable.empty();
 }

 checkAuthorised(): void {
 if (!this.token.token.length) {
 this.router.navigate(['login']);
 }
 }
 }
 */
