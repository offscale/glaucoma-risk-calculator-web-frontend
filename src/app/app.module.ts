import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule, MatToolbarModule } from '@angular/material';
import { SurveyModule } from './survey/survey.module';
import { StepperService } from './stepper.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyService } from './survey/survey.service';

@NgModule({
  declarations: [
    AppComponent
    // ResultsTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FlexLayoutModule,

    MatToolbarModule,
    MatTableModule,

    SurveyModule.forRoot()
  ],
  providers: [StepperService, SurveyService],
  bootstrap: [AppComponent]
})
export class AppModule {}
