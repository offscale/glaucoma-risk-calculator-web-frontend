import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as math from 'mathjs';
import { ethnicity2study, IRiskJson } from 'glaucoma-risk-calculator-engine';
import { RiskStatsService } from '../api/risk_stats/risk-stats.service';
import { RiskQuiz } from './risk-quiz.model';


math.config({
  number: 'BigNumber',  // Default type of number:
                        // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 20         // Number of significant digits for BigNumbers
});

@Component({
  selector: 'app-risk-quiz-form',
  templateUrl: './risk-quiz-form.component.html'
})
export class RiskQuizFormComponent implements OnInit, AfterViewInit {
  riskQuiz: RiskQuiz = new RiskQuiz(null, null, null);
  submitted = false;
  isCopied = false;
  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;
  result: number;
  ethnicity2study: {};

  riskForm: FormGroup;

  ethnicities: string[];
  all_ethnicities: string[];

  formErrors = {
    gender: '',
    age: '',
    ethnicity: ''
  };

  validationMessages = {
    gender: {
      'required': 'Gender is required.',
    },
    age: {
      'required': 'Age is required.'
    },
    ethnicity: {
      'required': 'Ethnicity is required.'
    }
  };

  constructor(private fb: FormBuilder, private riskStatsService: RiskStatsService) {
  }

  ngAfterViewInit() {
    this.riskStatsService.read('latest').subscribe(
      content => {
        this.riskStatsService.risk_stats = content.risk_json as IRiskJson;
        this.ethnicity2study = ethnicity2study(this.riskStatsService.risk_stats);
        this.all_ethnicities = this.ethnicities = Object.keys(this.ethnicity2study).sort();
        /*
        this.all_ethnicities = list_ethnicities(this.riskStatsService.risk_stats);
        console.info('[list_ethnicities] this.all_ethnicities =', this.all_ethnicities);
        console.info(`[list_ethnicities] this.all_ethnicities = ${this.all_ethnicities}`);
        this.ethnicities = ethnicities_pretty(this.all_ethnicities) as any;
        console.info('[ethnicities_pretty] this.all_ethnicities =', this.all_ethnicities);
        */
      },
      console.error
    );
  }

  ngOnInit(): void {
    this.buildForm()
  }

  onSubmit() {
    this.submitted = true;
    this.riskQuiz = this.riskForm.value;
  }

  addRisk() {
    this.riskQuiz = new RiskQuiz(null, null, null);
    this.buildForm();

    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  buildForm(): void {
    this.riskForm = this.fb.group({
      'age': [this.riskQuiz.age, [
        Validators.required
      ]
      ],
      'gender': [this.riskQuiz.gender, [
        Validators.required
      ]],
      'ethnicity': [this.riskQuiz.ethnicity, Validators.required],
      'sibling': [this.riskQuiz.sibling],
      'parent': [this.riskQuiz.parent]
    });

    this.riskForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.riskForm) return;
    const form = this.riskForm;

    let hasError = false;
    for (const field in this.formErrors)
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key))
              this.formErrors[field] += messages[key] + ' ';
          }
          hasError = true;
        }
      }
    // if (!hasError) this.riskQuiz.calcRisk(risk_json)
  }
}
