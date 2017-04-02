import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskQuizComponent } from './risk-quiz.component';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng2-select';
import { ModalModule, TypeaheadModule } from 'ng2-bootstrap';

@NgModule({
  imports: [
    CommonModule, FormsModule, SelectModule,
    ModalModule.forRoot(), TypeaheadModule.forRoot()
  ],
  declarations: [RiskQuizComponent],
  exports: [RiskQuizComponent]
})
export class RiskQuizModule {
}
