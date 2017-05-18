import { Component, OnInit } from '@angular/core';
import { IEmailTpl, IEmailTplBase } from '../api/email_tpl/email-tpl';
import { EmailTplService } from '../api/email_tpl/email-tpl.service';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-email-tpl',
  templateUrl: './email-tpl.component.html',
  styleUrls: ['./email-tpl.component.css']
})
export class EmailTplComponent implements OnInit {
  constructor(private alertsService: AlertsService,
              private emailTplService: EmailTplService) {
  }

  keyupHandlerFunction(content: string) {
    this.emailTplService.setTpl(content);
  }

  ngOnInit() {
    this.keyupHandlerFunction(this.emailTplService.hasTpl() ? this.emailTplService.email_tpl.tpl : '');
  }

  tplCreate(new_email_tpl: IEmailTplBase) {
    this.emailTplService.create(new_email_tpl).subscribe(this.handleEmailTpl, this.handleError)
  }

  tplRead(createdAt: string | Date) {
    this.emailTplService.read(createdAt).subscribe(
      (email_tpl: IEmailTpl) =>
        this.emailTplService.email_tpl = email_tpl,
      error =>
        this.alertsService.add({type: 'warning', msg: error})
    )
  }

  tplUpdate(new_email_tpl: IEmailTplBase) {
    new_email_tpl.createdAt = this.emailTplService.email_tpl.createdAt;

    this.emailTplService.update(
      Object.assign({updatedAt: new Date()}, this.emailTplService.email_tpl),
      new_email_tpl
    ).subscribe(this.handleEmailTpl, this.handleError)
  }

  tplDestroy(createdAt: string | Date) {
    this.emailTplService.destroy(createdAt).subscribe(
      _ => _,
      this.handleError
    )
  }

  save() {
    /* tslint:disable:no-unused-expression */
    (this.emailTplService.hasTpl() ?
      this.tplUpdate(Object.assign({tpl: this.emailTplService.email_tpl.tpl}, this.emailTplService.email_tpl))
      : this.tplCreate({
        tpl: this.emailTplService.email_tpl.tpl,
        createdAt: new Date().toISOString()
      })) || this.alertsService.add({type: 'info', msg: 'Updated email template'})
  }

  private handleEmailTpl(email_tpl: IEmailTpl) {
    this.emailTplService.email_tpl = email_tpl;
  }

  private handleError(error: string) {
    this.alertsService.add({type: 'warning', msg: error})
  }
}
