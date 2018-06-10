import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { QuillEditorComponent } from 'ngx-quill';


@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: [
    './richtext.component.css',
    './../../../node_modules/quill/dist/quill.snow.css',
    './../../../node_modules/quill/dist/quill.bubble.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class RichTextComponent implements AfterViewInit, OnInit {
  @Input() elementId: String;
  @Output() whenEdited: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('editor') editor: QuillEditorComponent;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      editor: ''
    });
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(content => this.whenEdited.emit(content.editor));
  }

  setFocus($event) {
    $event.focus();
  }

  public patchValue(content?: string) {
    this.form.controls['editor'].patchValue(
      content ? content : `${this.form.controls['editor'].value} patched!`
    );
  }

  public setValue(content: string) {
    this.form.setValue({
      editor: content || ''
    });
  }
}
