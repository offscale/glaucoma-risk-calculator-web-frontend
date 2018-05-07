import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GaugeModule } from 'ng-gauge/dist';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { RiskResService } from '../../api/risk_res/risk_res.service';
import { RiskQuizFormSubmittedComponent } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';
import { riskQuizFormSubmittedRoutes } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.routes';
import { RiskPointerComponent } from '../risk-pointer/risk-pointer.component';
import { RiskQuizFormComponent } from './risk-quiz-form.component';


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, BrowserAnimationsModule, FormsModule,
    RouterModule, RouterModule.forChild(riskQuizFormSubmittedRoutes),
    PaginationModule.forRoot(), CollapseModule.forRoot(), TypeaheadModule.forRoot(),
    ModalModule.forRoot(), GaugeModule, ClipboardModule, NgxSelectModule, NgxChartsModule
  ],
  providers: [RiskStatsService, RiskResService],
  declarations: [
    RiskQuizFormComponent, RiskQuizFormSubmittedComponent, RiskPointerComponent
  ],
  exports: [RiskQuizFormComponent]
})
export class RiskQuizFormModule {
}
