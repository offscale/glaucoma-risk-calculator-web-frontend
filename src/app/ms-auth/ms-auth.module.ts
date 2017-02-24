import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsAuthComponent } from './ms-auth.component';
import { MsAuthService } from './ms-auth.service';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ng2-bootstrap';

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
