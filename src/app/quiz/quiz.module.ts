import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { QuizComponent } from './quiz.component';
import { quizRoutes } from './quiz.routes';


@NgModule({
  declarations: [QuizComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(quizRoutes),
    FlexLayoutModule,
    MatButtonModule, MatCheckboxModule, MatInputModule, MatRadioModule, MatSelectModule, MatSnackBarModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    RiskStatsService
  ]
})
export class QuizModule {}
