import 'rxjs/add/observable/of';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { AlertsService } from '../alerts/alerts.service';
import * as math from 'mathjs';
import { IRiskQuiz } from './risk-quiz.model';

math.config({
  number: 'BigNumber',  // Default type of number:
                        // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 20         // Number of significant digits for BigNumbers
});


// least susceptible / low risk
// susceptible / medium risk
// highly susceptible / high risk

@Component({
  selector: 'app-risk-quiz',
  templateUrl: './risk-quiz.component.html',
  styleUrls: ['./risk-quiz.component.css']
})
export class RiskQuizComponent implements OnInit {
  public evilIn: any;
  public evil: any;
  private result: number;
  private submitted: boolean = false;
  public model: IRiskQuiz = {} as IRiskQuiz;
  public riskQuizForm: any;
  public quiz: {};
  public ocular_diseases: Array<string> = [
    'trauma', 'inflammation', 'pseudoexfoliation', 'pigment dispersion syndrome'
  ];
  public ocular_surgeries: Array<string> = [
    'retinal detachment', 'corneal transplant', 'congenital cataracts'
  ];

  @ViewChild('childModal') public childModal: ModalDirective;

  constructor(private alertsService: AlertsService) {
  }

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }

  ngOnInit() {
    //console.info(list_ethnicities(risk_json));
  }

  onSubmit() {
    this.submitted = true;
    this.result = 5;
    /*risk_from_study(risk_json, {
     study: this.model.ethnicity,
     age: this.model.age, gender: this.model.gender
     });*/
    this.childModal.show();
  }

  ocular_diseases_selected(values: Array<{ id: string, name: string }>) {
    this.model.ocular_disease_history = values.map(v => v.id);
  }

  email() {
    this.childModal.hide();
    this.alertsService.add({msg: 'Your risk is being calculated, and will be emailed', type: 'info'})
  }
}
