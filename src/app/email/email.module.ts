import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { TemplateService } from '../../api/template/template.service';
import { ConfigService } from '../../api/config/config.service';
import { TemplateModule } from '../template/template.module';
import { MsAuthModule } from '../ms-auth/ms-auth.module';
import { EmailComponent } from './email.component';


@NgModule({
  imports: [
    CommonModule, HttpModule, FormsModule, TemplateModule, MsAuthModule
  ],
  declarations: [EmailComponent],
  providers: [TemplateService, ConfigService]
})
export class EmailModule {
}
