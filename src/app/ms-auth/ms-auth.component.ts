import { Component, OnInit } from '@angular/core';

import { EmailConfService } from '../../api/email_conf/email_conf.service';
import { EmailTplService } from '../../api/email_tpl/email-tpl.service';
import { AlertsService } from '../alerts/alerts.service';
import { MsAuthService } from './ms-auth.service';
import { IEmailConf } from '../../api/email_conf/email_conf.interfaces';

@Component({
  selector: 'app-ms-auth',
  templateUrl: './ms-auth.component.html',
  styleUrls: ['./ms-auth.component.css']
})
export class MsAuthComponent implements OnInit {
  public isCollapsed = true;
  mail_base: {recipient: string, subject: string} = {} as any;
  email_conf: IEmailConf;

  constructor(private alertsService: AlertsService,
              private msAuthService: MsAuthService,
              private emailConfService: EmailConfService,
              private emailTplService: EmailTplService) {
  }

  private _client_id: string;

  public get client_id(): string {
    return this.email_conf.client_id;
  }

  public set client_id(val: string) {
    this._client_id = val;
  }

  private _tenant_id: string;

  public get tenant_id(): string {
    return this.email_conf.tenant_id;
  }

  public set tenant_id(val: string) {
    this._tenant_id = val;
  }

  ngOnInit() {
    this.emailConfService.getConf().subscribe(email_conf => this.email_conf = email_conf, console.error)
  }

  login() {
    this.msAuthService.login();
  }

  loggedIn(): boolean {
    return !!this.msAuthService.access_token;
  }

  logout() {
    this.msAuthService.logout();
  }

  sendTestEmail() {
    /* tslint:disable:no-console */
    console.info('MsAuthComponent::sendTestEmail');
    this.msAuthService.sendEmail({
      recipient: this.mail_base.recipient,
      subject: this.mail_base.subject,
      content: this.emailTplService.email_tpl.tpl
    }).subscribe(email => console.info(email) || this.alertsService.add({
      type: 'info', msg: 'Sent email'
    }), console.error);
  }

  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  public updateAuth() {
    this.emailConfService.insertConf({
      client_id: this._client_id,
      tenant_id: this._tenant_id,
      access_token: this.msAuthService.access_token
    }).subscribe(
      auth => console.info(auth) || this.alertsService.add({ type: 'info', msg: 'Updated auth' }),
      error => console.error(error) // this.authService.redirOnResIfUnauth(error)
    )
  }
}
