import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyComponent } from './survey/survey.component';

@Component({
  /* tslint:disable:component-selector */
  selector: 'glaucoma-risk-calculator',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('survey', { static: true }) survey: SurveyComponent;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if ((event as {url: string}).url
        && (event as {url: string}).url.startsWith('/results')
        && this.survey != null && this.survey.stepper != null) {
        switch (this.survey.stepper.selectedIndex /* TODO: enum */) {
          case 0:
            if (this.survey.stepper.steps != null) {
              this.survey.stepper.next();
            }
            break;
          case 2:
            if (this.survey.stepper.steps != null) {
              this.survey.stepper.previous();
            }
            break;
          default:
            break;
        }
      }
    });
  }
}
