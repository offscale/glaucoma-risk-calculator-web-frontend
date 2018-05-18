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

  constructor(private fb: FormBuilder,
              private alertsService: AlertsService,
              private templateService: TemplateService) {
    this.form = this.fb.group({
      email_subject: ['', Validators.required],
      twitter: ['', [Validators.required, Validators.maxLength(240)]],
      facebook: ['', Validators.required],
      // email: this.editor.form.controls
      // editor: this.editor.form.controls
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.templateService
      .readBatch()
      .subscribe(() => {
        const values = Array.from(this.templateService.templates.keys())
          .filter(kind => kind !== 'email')
          .reduce(
            (obj, kind) => Object.assign(obj, { [kind]: this.templateService.getTpl(kind) }), {})
        ;
        if (Object.keys(values).length) {
          this.editor.setValue(this.templateService.getTpl('email'));
          this.form.setValue(values);
        }
        }
      )
  }

  save() {
    // novalidate [ngClass]="{'was-validated': (form.touched || form.dirty) && !form.valid }"

    const now = new Date().toISOString();

    const templates: ITemplateBase[] = [
      {
        contents: this.templateService.getTpl('email'),
        kind: 'email',
        createdAt: now
      }
    ].concat(
      Object
        .keys(this.form.value)
        .map(k => ({ kind: k, contents: this.form.value[k], createdAt: now }))
    );

    // reactive forms should validate, but doesn't, so here is a hack:
    let invalid = false;
    for (const template of templates) {
      if ((!template.contents || template.contents.length < 1)) {
        if (template.kind !== 'email')
          this.form.controls[template.kind].setErrors({ 'incorrect': true });
        else
          this.editor.form.setErrors({ 'incorrect': true });
        invalid = true;
      }
    }
    if (invalid) {
      this.form.markAsDirty();
      this.alertsService.add({ type: 'warning', msg: 'Add template for each' });
    } else
      this.tplBatchCreate(templates, (err, created_templates) => {
        if (err != null) this.alertsService.add(err);
        else this.alertsService.add({ type: 'info', msg: 'Updated templates' })
      });
  };

  tplCreate(new_template: ITemplateBase, cb) {
    if (
      new_template == null) return cb(new TypeError('new_template must be defined'));
    this.templateService
      .create(new_template)
      .subscribe(template => this.handleTemplate(template, template.kind, cb), this.handleError.bind(this))
  };

  tplBatchCreate(new_templates: ITemplateBase[], cb) {
    if (new_templates == null) return cb(new TypeError('new_templates must be defined'));
    this.templateService
      .createBatch(new_templates)
      .subscribe(templates => {
          templates.templates
            .forEach(template => this.handleTemplate(template, template.kind));
          return cb(void 0, templates)
        },
        cb
      )
  };

  tplRead(createdAt: string | Date, kind: string, cb: (Error, string?) => void) {
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

  onEdited(content: string) {
    this.templateService.setTpl(content);
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

  /* // Would be better to not update, in case drafts are introduced
  tplUpdate(new_template: ITemplateBase) {
    new_template.createdAt = this.templateService.templates.createdAt;

    this.templateService
      .update(
        Object.assign({ updatedAt: new Date() }, this.templateService.templates),
        new_template)
      .subscribe(this.handleTemplate, this.handleError.bind(this))
  }*/

  tplDestroy(createdAt: string | Date) {
    this.templateService
      .destroy(createdAt)
      .subscribe(_ => _,
        this.handleError.bind(this)
      )
  }

  private handleError(error: string) {
    this.alertsService.add({ type: 'warning', msg: error })
  }

  validTwitterLength(): boolean {
    return this.form.value.twitter.length < 240
  }
}
