import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { EmailTplService } from '../../api/email_tpl/email-tpl.service';
import { IEmailTpl, IEmailTplBase } from '../../api/email_tpl/email-tpl';
import { AlertsService } from '../alerts/alerts.service';
import { RichTextComponent } from '../richtext/richtext.component';


@Component({
  selector: 'app-email-tpl',
  templateUrl: './email-tpl.component.html',
  styleUrls: ['./email-tpl.component.css']
})
export class EmailTplComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor: RichTextComponent;

  constructor(private alertsService: AlertsService,
              private emailTplService: EmailTplService) {
  }

  onEdited(content: string) {
    this.emailTplService.setTpl(content);
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    this.onEdited(
      this.emailTplService.hasTpl() ?
        this.emailTplService.email_tpl.tpl
        : ''
    )
  }

  tplCreate(new_email_tpl: IEmailTplBase, cb) {
    if (!new_email_tpl) return cb(new TypeError('new_email_tpl must be defined'));
    this.emailTplService
      .create(new_email_tpl)
      .subscribe(email_tpl => this.handleEmailTpl(email_tpl, cb), this.handleError)
  }

  tplRead(createdAt: string | Date, cb: (Error, string?) => void) {
    this.emailTplService.read(createdAt)
      .subscribe((email_tpl: IEmailTpl) => {
          this.emailTplService.email_tpl = email_tpl;
          return cb(void 0, email_tpl);
        },
        error => {
          this.alertsService.add({ type: 'warning', msg: error });
          return cb(error);
        }
      )
  }

  /* // Would be better to not update, in case drafts are introduced
  tplUpdate(new_email_tpl: IEmailTplBase) {
    new_email_tpl.createdAt = this.emailTplService.email_tpl.createdAt;

    this.emailTplService
      .update(
        Object.assign({ updatedAt: new Date() }, this.emailTplService.email_tpl),
        new_email_tpl)
      .subscribe(this.handleEmailTpl, this.handleError)
  }*/

  tplDestroy(createdAt: string | Date) {
    this.emailTplService
      .destroy(createdAt)
      .subscribe(_ => _,
        this.handleError
      )
  }

  save() {
    this.tplCreate({
      tpl: this.emailTplService.email_tpl.tpl,
      createdAt: new Date().toISOString()
    }, (err, email_tpl) => {
      if (err) this.alertsService.add(err);
      else this.alertsService.add({ type: 'info', msg: 'Updated email template' })
    });
  }

  private init() {
    this.tplRead('latest', (err, email_tpl) =>
      !err && email_tpl && this.editor.patchValue(email_tpl.tpl)
    );
  }

  private handleEmailTpl(email_tpl: IEmailTpl, cb?: (Error, string) => void) {
    this.emailTplService.email_tpl = email_tpl;
    if (cb) return cb(void 0, email_tpl);
  }

  private handleError(error: string) {
    this.alertsService.add({ type: 'warning', msg: error })
  }
}
