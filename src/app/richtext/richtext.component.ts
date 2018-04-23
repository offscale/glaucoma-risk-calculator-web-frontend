import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';

import { EmailTplService } from '../../api/email_tpl/email-tpl.service';

/*
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/autoresize/plugin';
*/

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css']
})
export class RichTextComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() elementId: String;

  // new
  @ViewChild('editor') editor: QuillEditorComponent;
  form: FormGroup;

  constructor(private zone: NgZone,
              private emailTplService: EmailTplService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      editor: ['test']
    });
  }

  ngAfterViewInit() {
    this.emailTplService.hasTpl() ? this.init()
      : this.emailTplService
        .read('latest')
        .subscribe(email_tpl => {
            console.info('email_tpl =', email_tpl, ';');
            this.emailTplService.email_tpl = email_tpl;
            // this.init();
          },
          error => console.error(error) || this.init()
        )
  }

  ngOnDestroy() {
    // tinymce.remove(this.editor);
  }

  setFocus($event) {
    $event.focus();
  }

  patchValue() {
    this.form.controls['editor'].patchValue(`${this.form.controls['editor'].value} patched!`)
  }

  setControl() {
    this.form.setControl('editor', new FormControl('test - new Control'))
  }

  private init() {
    /*tinymce.init({
      selector: `#${this.elementId}`,
      plugins: ['link', 'paste' //, 'table'
      ],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('init', ed2 => {
          if (this.emailTplService.hasTpl()) {
            ed2.target.setContent(this.emailTplService.email_tpl.tpl);
          }
        });
        editor.on('keyup change', () => {
          this.zone.run(() => {
            const content = editor.getContent();
            this.emailTplService.email_tpl.tpl = content;
            this.onEditorKeyup.emit(content);
          });
        });
      },
    });*/
  }
}
