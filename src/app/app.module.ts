import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

import { SurveyModule } from './survey/survey.module';
import { StepperService } from './stepper.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServerStatusModule } from './server-status/server-status.module';

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

    SurveyModule.forRoot(),
    ServerStatusModule
  ],
  providers: [StepperService],
  bootstrap: [AppComponent]
})
export class AppModule {}
