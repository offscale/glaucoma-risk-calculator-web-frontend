import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { SurveyComponent } from './survey.component';
import { SurveyService } from '../../api/survey/survey.service';


@NgModule({
  declarations: [SurveyComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    FlexLayoutModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatStepperModule
  ],
  exports: [SurveyComponent]
})
export class SurveyModule {
  public static forRoot(): ModuleWithProviders<SurveyModule> {
    return { ngModule: SurveyModule, providers: [SurveyService] };
  }
}
