import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';

import { RichTextComponent } from './richtext.component';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    QuillModule
  ],
  declarations: [RichTextComponent],
  exports: [RichTextComponent]
})
export class RichTextModule {
}
