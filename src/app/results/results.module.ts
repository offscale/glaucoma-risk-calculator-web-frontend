import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CdkTableModule } from '@angular/cdk/table';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { GaugeChartModule } from 'gauge-chart';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { RiskResService } from '../../api/risk_res/risk_res.service';
import { TemplateService } from '../../api/template/template.service';
import { ResultsTableComponent } from '../results-table/results-table.component';
import { ResultsComponent } from './results.component';
import { resultsRoutes } from './results.routes';


@NgModule({
  declarations: [ResultsComponent, ResultsTableComponent],
  imports: [
    CommonModule, RouterModule.forChild(resultsRoutes),
    FlexLayoutModule,
    MatButtonModule, MatCardModule, MatExpansionModule, MatTableModule, CdkTableModule,
    GaugeChartModule, ClipboardModule, NgxChartsModule
  ],
  providers: [
    HttpClientModule, RiskStatsService, RiskResService, TemplateService
  ]
})
export class ResultsModule {}
