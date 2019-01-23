import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigService } from '../../api/config/config.service';
import { TemplateService } from '../../api/template/template.service';
import { AlertsService } from '../alerts/alerts.service';
import { IMail, MsAuthService } from './ms-auth.service';


@Component({
  selector: 'app-ms-auth',
  templateUrl: './ms-auth.component.html',
  styleUrls: ['./ms-auth.component.css']
})
export class MsAuthComponent implements OnInit {
  email_form: FormGroup;
  advanced_form: FormGroup;

  public isCollapsed = true;

  constructor(private fb: FormBuilder,
              private alertsService: AlertsService,
              private msAuthService: MsAuthService,
              private confService: ConfigService,
              private templateService: TemplateService) {
    this.email_form = this.fb.group({
      test_recipient: ['', Validators.required],
      test_subject: ['', Validators.required]
    });

    this.advanced_form = this.fb.group({
      client_id: ['', Validators.required],
      client_secret: '',
      tenant_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.confService
      .get()
      .subscribe(conf =>
        conf && Object.keys(conf).length &&
        this.advanced_form.setValue(
          Object
            .keys(conf)
            .reduce((obj: {}, key: string) =>
              ['client_id', 'client_secret', 'tenant_id'].indexOf(key) > -1 ?
                Object.assign({ [key]: conf[key] }, obj) : obj, {}
            )
        )
      );
  }

  login() {
    this.msAuthService.login('code');
  }

  loggedIn(): boolean {
    return localStorage.getItem('ms::access_token') != null;
  }

  logout() {
    this.msAuthService.logout();
  }

  sendTestEmail() {
    /* tslint:disable:no-console */
    console.info('MsAuthComponent::sendTestEmail');
    this.msAuthService
      .localSendEmail(Object.assign(
        { content: this.templateService.getTpl('email') },
        Object
          .keys(this.email_form.value)
          .map(k => {
            const sw = 'test_';
            return { [k.startsWith(sw) ? k.slice('sw'.length) : k]: this.email_form.value[k] }
          })
          .reduce((a, b) => Object.assign(a, b), {}) as IMail
      ))
      .subscribe(email => console.info(email) as any || this.alertsService.add({
          type: 'info', msg: 'Sent email'
        }), console.error
      );
  }

  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  public updateAuth() {
    const access_token = localStorage.getItem('ms::access_token');
    this.confService
      .post(Object.assign(
        access_token == null ? {} : { access_token },
        this.advanced_form.value
      ))
      .subscribe(
        auth => console.info(auth) as any || this.alertsService.add({ type: 'info', msg: 'Updated auth' }),
        console.error.bind(console) // error => this.authService.redirOnResIfUnauth(error)
      )
  }
}
