import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/autoresize/plugin';
import { EmailTplService } from '../api/email_tpl/email-tpl.service';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css']
})
export class RichTextComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(private zone: NgZone, private emailTplService: EmailTplService) {
  }

  @Input() elementId: String;
  @Output() onEditorKeyup: EventEmitter<any> = new EventEmitter();

  editor;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.emailTplService.hasTpl() ? this.init() : this.emailTplService.read('latest').subscribe(
      email_tpl => {
        this.emailTplService.email_tpl = email_tpl;
        this.init();
      },
      error => console.error(error) || this.init()
    )
  }

  private init() {
    tinymce.init({
      selector: `#${this.elementId}`,
      plugins: ['link', 'paste'/*, 'table'*/],
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
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
