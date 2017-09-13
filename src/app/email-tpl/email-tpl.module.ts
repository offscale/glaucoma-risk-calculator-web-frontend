import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmailTplComponent } from './email-tpl.component';
import { RichTextModule } from '../richtext/richtext.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, RichTextModule
  ],
  declarations: [EmailTplComponent],
  exports: [EmailTplComponent]
})
export class EmailTplModule {
}
