import { AfterContentInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StepperSelectionEvent } from '@angular/cdk/stepper';


import { merge, Observable } from 'rxjs';

import { SurveyService } from '../../api/survey/survey.service';
import { ISurvey, ISurveyBase } from '../../api/survey/survey.d';
import { StepperService } from '../stepper.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, AfterContentInit {
  public preQuestionsForm: FormGroup;
  public postQuestionsForm: FormGroup;
  @ViewChild('stepper', { static: true }) public stepper: MatStepper;
  // tslint:disable-next-line:no-input-rename
  @Input('select') public selectedStep;
  public showRiskQuiz1 = false;
  private showPost = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              public surveyService: SurveyService,
              private stepperService: StepperService) {
  }

  ngOnInit(): void {
    this.preQuestionsForm = this.formBuilder.group({
      perceived_risk: ['', Validators.required],
      recruiter: ['', Validators.required],
      eye_test_frequency: ['', Validators.required],
      glasses_use: ['', Validators.required]
    });

    this.postQuestionsForm = this.formBuilder.group({
      behaviour_change: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  ngAfterContentInit(): void {
    if (window.location.pathname.startsWith('/results/') && this.stepper != null && this.stepper.selectedIndex === 0) {
      this.showRiskQuiz1 = true;
      if (this.stepper.steps != null) {
        this.stepper.next();
      }
    }
    this.stepperService.stepper = this.stepper;
    // console.info('finalUrl.fragment:', this.router.getCurrentNavigation().finalUrl.fragment, ';');
  }

  public submit(): true {
    this.handleCheckValidityAndNextObservable(() => {});
    return true;
  }

  public next(): void {
    this.handleCheckValidityAndNextObservable(() => this.stepper.next());
  }

  public previous(): void {
    this.stepper.previous();
  }

  public selectedIndex(): number {
    return this.stepper.selectedIndex;
  }

  public reset(): void {
    this.preQuestionsForm.reset();
    this.postQuestionsForm.reset();
    this.stepper.reset();
    this.router
      .navigate(['/'])
      .catch(console.error);
  }

  stepClick($event: StepperSelectionEvent): void {
    const invalid = this.checkValidityAndNextObservable();
    if (typeof invalid === 'boolean' && invalid === false) {
      this.snackBar.open('Fill out required fields', void 0, { duration: 5000 });
      return;
    }
  }

  showPostQuestions(): boolean {
    return this.showPost;
  }

  showMsg(): void {
    this.snackBar.open('Submitted', void 0, { duration: 5000 });
  }

  private checkValidityAndNextObservable(): boolean | Observable<ISurvey | {email: string}> {
    switch (this.selectedIndex()) {
      case 0:
        if (this.preQuestionsForm.invalid) {
          return false;
        }
        return this.surveyService.create(this.preQuestionsForm.value);
      case 1:
        this.showPost = true;
        return true;
      case 2:
        if (this.postQuestionsForm.invalid) {
          return false;
        }
        const email: string = this.postQuestionsForm.value.email;
        const behaviour_change: ISurveyBase['behaviour_change'] = this.postQuestionsForm.value.behaviour_change;

        if (this.surveyService.survey.id == null) {
          this.snackBar.open('survey missing');
        }

        return merge(
          this.surveyService.addEmail(email),
          this.surveyService.update(this.surveyService.survey.id, { behaviour_change, email })
        );
    }
  }

  private handleCheckValidityAndNextObservable(subscriptionCallback: () => void): void {
    const invalid = this.checkValidityAndNextObservable();
    typeof invalid === 'boolean' && invalid === false ?
      this.snackBar.open('Fill out required fields', void 0, { duration: 5000 })
      : (invalid as Observable<ISurvey>).subscribe(() => subscriptionCallback());
  }
}
