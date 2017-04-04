import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as math from 'mathjs';
import { ethnicities_pretty, list_ethnicities } from 'glaucoma-risk-quiz-engine';
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
  submitted: boolean = false;
  isCopied: boolean = false;
  // TODO: Workaround until NgForm has a reset method (#6822)
  active: boolean = true;
  result: number;

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
        this.riskStatsService.risk_stats = content.risk_json;
        this.all_ethnicities = list_ethnicities(this.riskStatsService.risk_stats);
        this.ethnicities = ethnicities_pretty(this.all_ethnicities)
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
      'ethnicity': [this.riskQuiz.ethnicity, Validators.required]
    });

    this.riskForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.riskForm) {
      return;
    }
    const form = this.riskForm;

    let hasError: boolean = false;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
        hasError = true;
      }
    }
    //if (!hasError) this.riskQuiz.calcRisk(risk_json)
  }
}
