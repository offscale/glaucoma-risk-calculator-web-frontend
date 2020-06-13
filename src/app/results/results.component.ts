import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { all, create } from 'mathjs';


import { GaugeLabel, GaugeSegment } from 'gauge-chart';
import { calc_relative_risk, familial_risks_from_study, IMultiplicativeRisks, IRiskJson } from 'glaucoma-risk-calculator-engine';

import { RiskStatsService } from '../../api/risk_stats/risk-stats.service';
import { RiskResService } from '../../api/risk_res/risk_res.service';
import { TemplateService } from '../../api/template/template.service';
import { IRiskResBase } from '../../api/risk_res/risk_res';
import { IRiskQuiz, RiskQuiz } from '../quiz/risk-quiz.model';
import { colours, numToColour } from '../colours';
import { SurveyService } from '../../api/survey/survey.service';
import { ISurvey } from '../../api/survey/survey';
import { StepperService } from '../stepper.service';

const math = create(all);
math.config({
  number: 'BigNumber',  // Default type of number:
                        // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 5         // Number of significant digits for BigNumbers
});

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, AfterContentInit {
  // @Input()
  public riskQuiz: RiskQuiz = void 0;
  public mostAtRisk = '';
  public isCollapsed = true;
  public shareUrl: string;
  public recommendation: string;
  public recommendationSubtitle: string;
  public isCopied = false;
  public pieGrid = false;
  public gauge = false;
  public showTreemap = false;
  public submissionRow: IRiskResBase;
  public submissionHeader: string[] = [];

  // modalRef: NgbModalRef;
  public htmlOfAllRefs: HTMLAllCollection;
  // private pieAdvColorScheme = this.colorScheme;
  // line, area
  public htmlOfLastNote: HTMLAllCollection;

  // </pie grid>
  public notes: string[];
  @ViewChild('tweet', { static: true }) private tweet: HTMLAnchorElement;
  // private pieAdvLabel = 'times more at risk';
  // private pieAdvGradient = true;

  // </advanced-pie-chart>
  @Input() private submitted = false;
  private id: number = undefined;
  public progressGraph = {
    bgRadius: 60,
    bgColor: colours.indigo,
    rounded: false,
    reverse: false,
    animationSecs: 1,
    labels: [],
    segments: []
  };
  @Output() private submittedChange: EventEmitter<boolean> = new EventEmitter();
  // <pie grid>
  private colorScheme = { domain: [colours.teal, colours.darkred, colours.gold, colours.grey] };
  // private autoScale = true;
  private pieData = [
    /* { 'name': 'France', 'value': 7200000 } */
  ];
  // <advanced-pie-chart>
  private pieView: [760, 760];
  // private pieAdvDim: any[] = [700, 400];
  private pieAdvData = [];
  private showPieAdv = false;
  public treemapLegend: Array<{color: string, name: string, value: number}> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private riskStatsService: RiskStatsService,
              private riskResService: RiskResService,
              private surveyService: SurveyService,
              public templateService: TemplateService,
              public stepperService: StepperService) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation.extras.state != null) {
      // this.router.navigateByUrl('/').catch(e => { throw e; });
      this.riskQuiz = new RiskQuiz(currentNavigation.extras.state.riskQuiz);
    }
  }

  static getHostOrigin(): string {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ?
      ':' + window.location.port : ''}`;
  }

  ngOnInit(): void {
    if (!(this.riskQuiz instanceof RiskQuiz)) {
      this.riskQuiz = new RiskQuiz(this.riskQuiz);
    }
    this.templateService
      .readBatch()
      .subscribe(() => this.tweet.href = this.templateService.getTpl('twitter'));
  }

  ngAfterContentInit(): void {
    if (this.submitted) {
      this.prepareView();
    } else if (this.riskQuiz != null && this.riskQuiz.riskQuiz != null) {
      this.submitted = true;
      this.prepareView();
    } else if (this.route.snapshot.paramMap.has('id')) {
      this.id = this.riskResService.id = +this.route.snapshot.paramMap.get('id');
      this.riskResService
        .read(this.id)
        .subscribe((riskQuiz: IRiskQuiz | any) => {
          if (riskQuiz == null) {
            this.router.navigateByUrl('/').catch(e => { throw e; });
          }
          this.riskQuiz = new RiskQuiz(riskQuiz);
          this.submitted = true;
          this.prepareView();
        });
    } else {
      this.id = this.riskResService.id = void 0;
      this.router.navigateByUrl('/').catch(e => { throw e; });
    }
  }

  public redo(): void {
    this.submittedChange.emit(false);
    this.router
      .navigate(['/'])
      .catch(console.error);
  }

  public labelFormat = (label: {
    data: {
      data: {name: string, value: number},
      x: number, y: number, width: number, height: number,
      fill: string, label: string, value: number, valueType: undefined
    },
    label: string, value: number
  }): string => {
    const m = {
      'Chinese [Singapore: urban]': 'Chinese',
      'White European (Canadian; Italian; Irish; Welsh; Scottish)': 'White (Can.)',
      'White (Northern European: Australian)': 'White (Aus.)'
    };
    if (!label.data || !label.data.data) {
      console.warn('label.data.data is null');
      return;
    }
    if (this.treemapLegend.findIndex(o => o.color === label.data.fill) < 0) {
      this.treemapLegend.push({
        color: label.data.fill,
        name: label.data.data.name,
        value: label.data.data.value
      });
    }
    this.treemapLegend.sort((a, b) => a.value < b.value as any);
    return m[label.data.data.name] || label.data.data.name;
  };

  private idWithUrl(): string {
    return `${ResultsComponent.getHostOrigin()}/results/${this.id}`;
  }

  private onPieGridSelect(event): void {
    console.log(event);
  }

  /*private pieAdvOnSelect(event) {
    console.log(event);
  }*/

  /*
  sendEmail(recipient: string) {
    this.msAuthService
      .remoteSendEmail(this.id, {
        recipient: recipient,
        subject: this.templateService.getTpl('email_subject'),
        content: `${this.templateService.getTpl('email')} ${this.shareUrl}`
      })
      .subscribe(email => console.info('RiskQuizFormSubmittedComponent::sendEmail::email', email, ';') as any ||
        this.alertsService.add({
          type: 'info', msg: 'Sent email'
        }), console.error);
    this.modalRef.close();
  }
 */

  /*
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.open(template);
    // = this.modalService.show(template, { class: 'modal-sm' });
    this.modalRef.componentInstance.name = 'World';
  }
  */

  private gaugeView(riskPercent: number, riskPercentAsStr: string): void {
    this.progressGraph.labels.push(
      new GaugeLabel({
        color: colours.white,
        text: 'risk',
        x: 0,
        y: 20,
        fontSize: '1em'
      }),
      new GaugeLabel({
        color: numToColour(riskPercent),
        text: riskPercentAsStr,
        x: 0,
        y: 0,
        fontSize: '2em'
      })
    );
    this.progressGraph.segments.push(
      new GaugeSegment({
        value: riskPercent,
        color: numToColour(riskPercent),
        borderWidth: 20
      })
    );
    this.gauge = true;
  }

  // modal

  private pieAdvView(multiplicativeRisks: IMultiplicativeRisks): void {
    this.pieAdvData = Object
      .keys(multiplicativeRisks)
      .map(k => ({ name: k, value: multiplicativeRisks[k] }))
      .filter(o => o.value > 1);
    this.showPieAdv = this.riskQuiz.riskQuiz.sibling || this.riskQuiz.riskQuiz.parent;
  }

  private prepareView(): void {
    this.submissionHeader = Object
      .keys(this.riskQuiz.riskQuiz)
      .filter(k => ['createdAt', 'updatedAt', 'id', 'clientRisk'].indexOf(k) === -1);
    this.submissionRow =
      Object
        .keys(this.riskQuiz.riskQuiz)
        .map(k => ({ [k]: this.riskQuiz.riskQuiz[k] != null ? this.riskQuiz.riskQuiz[k] : false }))
        .reduce((a, b) => Object.assign(a, b), {}) as IRiskResBase;

    this.riskStatsService
      .read('latest')
      .subscribe(content => {
          this.riskStatsService.riskJson = content.risk_json as IRiskJson;
          try {
            this.riskQuiz.calcRisk(this.riskStatsService.riskJson);
          } catch (e) {
            this.router
              .navigate(['/'])
              .catch(console.error);
          }

          this.htmlOfAllRefs = JSON.parse(this.riskStatsService.riskJson.html_of_all_refs);
          this.htmlOfLastNote = this.riskStatsService.riskJson.global_notes.pop() as any as HTMLAllCollection;
          this.notes = this.riskStatsService.riskJson.global_notes;
          this.riskStatsService.risk = this.riskQuiz.risk;
          // this.riskQuiz.prepareRef();

          /*const multiplicativeRisks = {
            this.riskQuiz.risk
          };*/

          const familialRisk = familial_risks_from_study(this.riskStatsService.riskJson, this.riskQuiz.toJSON());
          const riskPercent: number =
            (pc => ((r => r > 100 ? 100 : r)(familialRisk.reduce((a, b) => a + b, 1) + pc)))(
              math.multiply(
                math.divide(this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1, this.riskQuiz.risks.length),
                100
              ));
          // const riskPercent = get_risk_pc.call(this);
          const riskPercentAsStr: string = (riskPercentAsNumber => {
            switch (true) {
              case math.smallerEq(riskPercentAsNumber, 25):
                return 'least';
              case math.smallerEq(riskPercentAsNumber, 50):
                return 'average';
              case math.smallerEq(riskPercentAsNumber, 75):
                return 'high';
              case math.larger(riskPercentAsNumber, 75):
              default:
                return 'greatest';
            }
          })(riskPercent);
          /*math.format(riskPercent, 6)*/
          /*(fmt_s => `${fmt_s.lastIndexOf('.') > -1 && fmt_s.length > 3 ? fmt_s.slice(0, -1) : riskPercent}%`)(
           math.format(riskPercent, 6)
           )*/
          this.mostAtRisk =
            `${this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1} / ${this.riskQuiz.risks.length}`;
          this.riskQuiz.relativeRisks = calc_relative_risk(this.riskStatsService.riskJson, this.riskQuiz.riskQuiz);
          this.showTreemap = true;

          this.gaugeView(riskPercent, riskPercentAsStr);
          this.pieAdvView(this.riskQuiz.multiplicativeRisks);

          this.riskQuiz.clientRisk = +riskPercent.toPrecision(4);

          this.recommendation = 'We recommend you see an eye-health professional ';
          this.recommendationSubtitle = 'Unless you\'ve seen one recently.';
          if (riskPercent <= 25) {
            this.recommendation += ' in the next two years.';
            this.recommendationSubtitle = 'Unless you\'ve seen one in the last 2 years';
          } else if (riskPercent <= 50) {
            this.recommendation += ' in the next year.';
            this.recommendationSubtitle = 'Unless you\'ve seen one in the last year';
          } else if (riskPercent <= 75) {
            this.recommendation += ' in the next 6 months.';
          } else {
            this.recommendation += ' ASAP.';
          }

          this.surveyService.resultQuizSucceeded = true;

          if (this.id == null) {
            const next = () => {
              this.shareUrl = this.idWithUrl();
              this.router.navigate(['/results', this.id]).catch(e => { throw e; });
            };

            this.riskResService
              .create(this.riskQuiz.toJSON())
              .subscribe(r => {
                this.id = this.riskResService.id = r.id;
                if (this.surveyService.survey == null) {
                  return next();
                }
                const survey: ISurvey = Object.assign(this.surveyService.survey, { risk_res_id: r.id });
                this.surveyService
                  .update(this.surveyService.survey.id, survey)
                  .subscribe(next);
              }, console.error);
          } else {
            this.shareUrl = this.idWithUrl();
          }
        },
        console.error
      );
  }
}
