import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { EmailTplModule } from '../email-tpl/email-tpl.module';
import { MsAuthModule } from '../ms-auth/ms-auth.module';
import { EmailTplService } from '../api/email_tpl/email-tpl.service';

@NgModule({
  imports: [
    CommonModule, HttpModule, FormsModule, EmailTplModule, MsAuthModule
  ],
  declarations: [EmailComponent],
  providers: [EmailTplService]
})
export class EmailModule {
}
