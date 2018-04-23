import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { EmailTplService } from '../../api/email_tpl/email-tpl.service';
import { EmailConfService } from '../../api/email_conf/email_conf.service';
import { EmailTplModule } from '../email-tpl/email-tpl.module';
import { MsAuthModule } from '../ms-auth/ms-auth.module';
import { EmailComponent } from './email.component';


@NgModule({
  imports: [
    CommonModule, HttpModule, FormsModule, EmailTplModule, MsAuthModule
  ],
  declarations: [EmailComponent],
  providers: [EmailTplService, EmailConfService]
})
export class EmailModule {
}
