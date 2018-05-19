import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap';

import { MsAuthComponent } from './ms-auth.component';
import { MsAuthService } from './ms-auth.service';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    CollapseModule.forRoot()
  ],
  providers: [MsAuthService],
  declarations: [MsAuthComponent],
  exports: [MsAuthComponent]
})
export class MsAuthModule {
}
