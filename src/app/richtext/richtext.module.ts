import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RichTextComponent } from './richtext.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RichTextComponent],
  exports: [RichTextComponent]
})
export class RichTextModule {
}
