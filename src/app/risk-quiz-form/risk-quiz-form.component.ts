import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ethnicity2study, IRiskJson } from 'glaucoma-risk-calculator-engine';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { RiskQuiz } from './risk-quiz.model';


@Component({
  selector: 'app-risk-quiz-form',
  templateUrl: './risk-quiz-form.component.html',
  styleUrls: ['./risk-quiz-form.component.css']
})
export class RiskQuizFormComponent implements OnInit, AfterViewInit {
  riskQuiz: RiskQuiz = new RiskQuiz({} as any);
  submitted = false;
  isCopied = false;
  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;
  ethnicity2study: {};

  riskForm: FormGroup;

  ethnicities: string[];
  all_ethnicities: string[];

  formErrors = {
    gender: '',
    age: '',
    ethnicity: '',
    myopia: '',
    diabetes: ''
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
  public doClose = () => document.getElementById('parent').focus();

  constructor(private fb: FormBuilder,
              private riskStatsService: RiskStatsService) {
  }

  ngAfterViewInit() {
    this.riskStatsService.read('latest').subscribe(
      content => {
        this.riskStatsService.risk_json = content.risk_json as IRiskJson;
        this.ethnicity2study = ethnicity2study(this.riskStatsService.risk_json);
        this.all_ethnicities = this.ethnicities = Object.keys(this.ethnicity2study).sort();
      },
      console.error
    );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  onSubmit() {
    this.submitted = true;
    if (this.riskForm.value.ethnicity != null && this.riskForm.value.ethnicity.length && this.riskForm.value.ethnicity instanceof Array)
      this.riskForm.value.ethnicity = this.riskForm.value.ethnicity[0].id;
    this.riskQuiz = new RiskQuiz(this.riskForm.value);
  }

  addRisk() {
    this.riskQuiz = new RiskQuiz({} as any);
    this.buildForm();

    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  buildForm(): void {
    this.riskForm = this.fb.group({
      age: [this.riskQuiz.riskQuiz.age, [Validators.required, Validators.min(0)]],
      gender: [this.riskQuiz.riskQuiz.gender, [Validators.required]],
      ethnicity: [this.riskQuiz.riskQuiz.ethnicity, Validators.required],
      sibling: [this.riskQuiz.riskQuiz.sibling],
      parent: [this.riskQuiz.riskQuiz.parent],
      myopia: [this.riskQuiz.riskQuiz.myopia],
      diabetes: [this.riskQuiz.riskQuiz.diabetes]
    });

    this.riskForm.valueChanges.subscribe(data => this.onValueChanged(data));

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

  public selected_ethnicity(ethnicity: Array<{id: string, text: string}>): void {
    if (ethnicity == null || !ethnicity.length) return;
    this.riskQuiz.riskQuiz.ethnicity = this.riskForm.value.ethnicity = ethnicity[0].id;
  }
}
