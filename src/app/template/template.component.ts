import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TemplateService } from '../../api/template/template.service';
import { ITemplate, ITemplateBase } from '../../api/template/template';
import { AlertsService } from '../alerts/alerts.service';
import { RichTextComponent } from '../richtext/richtext.component';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') editor: RichTextComponent;
  form: FormGroup;
  tplCreate = (new_template: ITemplateBase, cb) => {
    if (
      new_template == null) return cb(new TypeError('new_template must be defined'));
    this.templateService
      .create(new_template)
      .subscribe(template => this.handleTemplate(template, template.kind, cb), this.handleError)
  };
  tplBatchCreate = (new_templates: ITemplateBase[], cb) => {
    if (new_templates == null) return cb(new TypeError('new_templates must be defined'));
    this.templateService
      .createBatch(new_templates)
      .subscribe(templates => templates.templates.map(template => this.handleTemplate(template, template.kind)), this.handleError)
  };
  tplRead = (createdAt: string | Date, kind: string, cb: (Error, string?) => void) => {
    this.templateService.read(createdAt, kind)
      .subscribe((template: ITemplate) => {
          this.templateService.templates.set(kind, template);
          return cb(void 0, template);
        },
        error => {
          this.alertsService.add({ type: 'warning', msg: error });
          return cb(error);
        }
      )
  };
  save = () => {
    // novalidate [ngClass]="{'was-validated': (form.touched || form.dirty) && !form.valid }"

    const now = new Date().toISOString();
    this.tplBatchCreate([
      {
        contents: this.templateService.templates.get('email').contents,
        kind: 'email',
        createdAt: now
      },
      {
        contents: this.form.value.twitter,
        kind: 'twitter',
        createdAt: now
      },
      {
        contents: this.form.value.facebook,
        kind: 'facebook',
        createdAt: now
      },
    ], (err, template) => {
      if (err) this.alertsService.add(err);
      else this.alertsService.add({ type: 'info', msg: 'Updated email templates' })
    });
  };
  private handleError = (error: string) => {
    console.error('error =', error, ';');
    this.alertsService.add({ type: 'warning', msg: error })
  };

  constructor(private fb: FormBuilder,
              private alertsService: AlertsService,
              private templateService: TemplateService) {
    this.alertsService.add('constructor');
    this.form = this.fb.group({
      twitter: ['', [Validators.required, Validators.maxLength(240)]],
      facebook: ['', Validators.required]
    });
  }

  onEdited(content: string) {
    this.templateService.setTpl(content);
  }

  /* // Would be better to not update, in case drafts are introduced
  tplUpdate(new_template: ITemplateBase) {
    new_template.createdAt = this.templateService.templates.createdAt;

    this.templateService
      .update(
        Object.assign({ updatedAt: new Date() }, this.templateService.templates),
        new_template)
      .subscribe(this.handleTemplate, this.handleError)
  }*/

  ngOnInit() {
    this.init('email');
  }

  ngAfterViewInit() {
    this.onEdited(
      this.templateService.hasTpl() ?
        this.templateService.templates.get('email').contents
        : ''
    )
  }

  tplDestroy(createdAt: string | Date) {
    this.templateService
      .destroy(createdAt)
      .subscribe(_ => _,
        this.handleError
      )
  }

  validTwitterLength(): boolean {
    return this.form.value.twitter.length < 240
  }

  private init(kind: string) {
    this.tplRead('latest', kind, (err, template) =>
      !err && template && this.editor.patchValue(template.contents)
    );
  }

  private handleTemplate(template: ITemplate, kind: string, cb?: (Error, string) => void) {
    this.templateService.templates.set(kind, template);
    if (cb) return cb(void 0, template);
  }
}
