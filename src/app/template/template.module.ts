import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RichTextModule } from '../richtext/richtext.module';
import { TemplateComponent } from './template.component';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RichTextModule
  ],
  declarations: [TemplateComponent],
  exports: [TemplateComponent]
})
export class TemplateModule {
}
