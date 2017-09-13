import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap';

import { MsAuthComponent } from './ms-auth.component';
import { MsAuthService } from './ms-auth.service';


@NgModule({
  imports: [
    CommonModule, FormsModule, CollapseModule.forRoot()
  ],
  providers: [MsAuthService],
  declarations: [MsAuthComponent],
  exports: [MsAuthComponent]
})
export class MsAuthModule {
}
