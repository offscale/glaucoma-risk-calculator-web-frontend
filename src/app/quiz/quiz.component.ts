import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';

import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ethnicity2study, IRiskJson } from 'glaucoma-risk-calculator-engine';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  public riskQuiz: FormGroup;
  /** control for the selected ethnicity */
  private ethnicityCtrl = new FormControl();
  /** control for the MatSelect filter keyword */
  public ethnicityFilterCtrl = new FormControl();
  /** list of ethnicities filtered by search keyword */
  public filteredEthnicities = new ReplaySubject<string[]>(1);
  private ethnicities: string[] = [];
  private ethnicity2study: {};

  /** Subject that emits when the component has been destroyed. */
  private destructionSubject = new Subject<void>();

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private riskStatsService: RiskStatsService
              /*private surveyService: SurveyService*/) {
  }

  ngOnInit(): void {
    this.riskStatsService
      .read('latest')
      .subscribe(
        riskStats => {
          this.riskStatsService.riskJson = riskStats.risk_json as IRiskJson;
          this.ethnicity2study = ethnicity2study(this.riskStatsService.riskJson);
          this.ethnicities = Object.keys(this.ethnicity2study).sort().reverse();

          // set initial selection
          this.ethnicityCtrl.setValue(this.ethnicities[10]);

          // load the initial ethnicity list
          this.filteredEthnicities.next(this.ethnicities.slice());

          // listen for search field value changes
          this.ethnicityFilterCtrl.valueChanges
            .pipe(takeUntil(this.destructionSubject))
            .subscribe(() => {
              this.filterEthnicities();
            });

          this.riskQuiz = this.fb.group({
            gender: ['', Validators.required],
            age: ['', [
              Validators.min(0), Validators.max(111), Validators.required
            ]],
            ethnicity: ['', Validators.required],
            sibling: [''],
            parent: [''],
            myopia: ['' /*this.surveyService.survey.glasses_use === 'shortsighted'*/],
            diabetes: ['']
          });
        }
      );
  }

  ngAfterContentInit(): void {
    this.setInitialValue();
  }

  ngOnDestroy(): void {
    this.destructionSubject.next();
    this.destructionSubject.complete();
  }

  public onSubmit(): void {
    const route = this.router.config.find(r => r.path === 'results');
    this.riskQuiz.value.study = this.ethnicity2study[this.riskQuiz.value.ethnicity];

    if (this.riskQuiz.invalid) {
      this.snackBar.open(
        'Fill out required fields to find your risk',
        void 0, { duration: 5000 }
      );

      /*
      // Simple message with an action.
      let snackBarRef = this.snackBar.open('Message archived', 'Undo');

      // Load the given component into the snack-bar.
      let snackBarRef = this.snackBar.openFromComponent(QuizComponent);
       */

    } else {
      route.data = { riskQuiz: this.riskQuiz.value };
      this.router
        .navigate(['/results'], { state: route.data })
        .catch(e => { throw e; });
    }
  }

  /**
   * Sets the initial value after the filteredEthnicities are loaded initially
   */
  private setInitialValue(): void {
    if (this.singleSelect == null) {
      return;
    }
    this.filteredEthnicities
      .pipe(take(1), takeUntil(this.destructionSubject))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredEthnicities are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
      });
  }

  private filterEthnicities(): void {
    if (!this.ethnicities) {
      return;
    }
    // get the search keyword
    let search = this.ethnicityFilterCtrl.value;
    if (!search) {
      this.filteredEthnicities.next(this.ethnicities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the ethnicities
    this.filteredEthnicities.next(
      this.ethnicities
        .filter(ethnicity => ethnicity.toLowerCase().indexOf(search) > -1)
    );
  }
}
