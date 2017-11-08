import * as math from 'mathjs';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GaugeLabel, GaugeSegment } from 'ng-gauge/dist';
import { calc_relative_risk, familial_risks_from_study, IMultiplicativeRisks, IRiskJson } from 'glaucoma-risk-calculator-engine';

import 'rxjs/add/operator/switchMap';

import { RiskStatsService } from 'app/api/risk_stats/risk-stats.service';
import { IRiskQuiz, RiskQuiz } from '../risk-quiz-form/risk-quiz.model';
import { RiskResService } from '../api/risk_res/risk_res.service';
import { MsAuthService } from '../ms-auth/ms-auth.service';
import { colours, numToColour } from '../colours';


math.config({
  number: 'BigNumber',  // Default type of number:
                        // 'number' (default), 'BigNumber', or 'Fraction'
  precision: 5         // Number of significant digits for BigNumbers
});


const omit = (obj: {}, omitKeys: string[]): {} =>
  Object
    .keys(obj)
    .reduce((result, key) => {
        if (omitKeys.indexOf(key) > -1)
          result[key] = obj[key];
        return result;
      }, {}
    );

export interface IItem {
  id?: string;
  type?: string;
  issued?: string;
  DOI?: string;
  URL?: string;
  chapter?: string;
  publisher?: string;
  issn?: string;
  isbn?: string;
  author?: string;
  series?: string;
  booktitle?: string;
  title?: string;
  number?: string;
  pages?: string;
  note?: string;
  edition?: string;
  editor?: string;
  address?: string;
  annote?: string;
  journal?: string;
  volume?: string;
}

@Component({
  selector: 'app-risk-quiz-form-submitted',
  templateUrl: './risk-quiz-form-submitted.component.html',
  styleUrls: ['./risk-quiz-form-submitted.component.css']
})
export class RiskQuizFormSubmittedComponent implements OnInit, AfterContentInit {
  @Input() riskQuiz: RiskQuiz;
  @Input() submitted = false;
  most_at_risk = '';
  isCollapsed = true;
  id: number = undefined;
  share_url: string;
  recommendation: string;
  recommendation_subtitle: string;

  progressGraph = {
    bgRadius: 60,
    bgColor: colours.indigo,
    rounded: false,
    reverse: false,
    animationSecs: 1,
    labels: [],
    segments: []
  };

  @Output() submittedChange: EventEmitter<boolean> = new EventEmitter();

  // <pie grid>
  colorScheme = { domain: [colours.teal, colours.darkred, colours.gold, colours.grey] };
  pieAdvColorScheme = this.colorScheme;
  // line, area
  autoScale = true;
  pieData = [
    /* { 'name': 'France', 'value': 7200000 } */
  ];

  // </pie grid>

  // <advanced-pie-chart>
  pieView: [760, 760];
  pieAdvDim: any[] = [700, 400];
  pieAdvData = [];
  pieAdvLabel = 'times more at risk';
  pieAdvGradient = true;

  // </advanced-pie-chart>

  pie_grid = false;
  show_pie_adv = false;
  added_risk = false;
  gauge = false;

  show_treemap = false;
  treemap_legend: Array<{color: string, name: string, value: number}> = [];

  submissionRow: {};
  submissionHeader: string[] = [];

  html_of_all_refs: HTMLAllCollection;
  html_of_last_note: HTMLAllCollection;
  notes: string[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private riskStatsService: RiskStatsService,
              private riskResService: RiskResService) {
  }

  redo() {
    this.submittedChange.emit(false);
    this.router
      .navigate(['/'])
      .catch(console.error);
  }

  ngOnInit() {
    if (!(this.riskQuiz instanceof RiskQuiz))
      this.riskQuiz = new RiskQuiz(this.riskQuiz);
  }

  ngAfterContentInit() {
    if (this.submitted)
      this.prepareView();
    else
      this.route
        .params
        .switchMap((params: Params) => {
          this.id = +params['id'];
          return this.riskResService.read(this.id)
        })
        .subscribe((riskQuiz: IRiskQuiz | any) => {
          this.riskQuiz = new RiskQuiz(riskQuiz);
          this.submitted = true;
          this.prepareView()
        });
  }

  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  parseRef(ref: IItem) {
    /* tslint:disable:no-console */
    console.info('ref keys =', Object.keys(ref));
    return JSON.stringify(ref)
  }

  idWithUrl(): string {
    return `${MsAuthService.getHostOrigin()}/results/${this.id}`;
  }

  onPieGridSelect(event) {
    console.log(event);
  }

  pieAdvOnSelect(event) {
    console.log(event);
  }

  private prepareView() {
    this.submissionHeader = Object
      .keys(this.riskQuiz.riskQuiz)
      .filter(k => ['createdAt', 'updatedAt', 'id', 'client_risk'].indexOf(k) === -1);
    this.submissionRow =
      Object
        .keys(this.riskQuiz.riskQuiz)
        .map(k => ({ [k]: this.riskQuiz.riskQuiz[k] != null ? this.riskQuiz.riskQuiz[k] : false }))
        .reduce((a, b) => Object.assign(a, b), {})
    ;

    this.riskStatsService
      .read('latest')
      .subscribe(content => {
          this.riskStatsService.risk_json = content.risk_json as IRiskJson;
          try {
            this.riskQuiz.calcRisk(this.riskStatsService.risk_json);
          } catch (e) {
            this.router
              .navigate(['/'])
              .catch(console.error);
          }

          this.html_of_all_refs = JSON.parse(this.riskStatsService.risk_json.html_of_all_refs);
          this.html_of_last_note = this.riskStatsService.risk_json.global_notes.pop() as any;
          this.notes = this.riskStatsService.risk_json.global_notes;
          this.riskStatsService.risk = this.riskQuiz.risk;
          this.riskQuiz.ref = this.riskStatsService.risk_json.studies[this.riskQuiz.study].ref;
          // this.riskQuiz.prepareRef();

          const fam_risk = familial_risks_from_study(this.riskStatsService.risk_json, this.riskQuiz.toJSON());
          const risk_pc =
            (pc => ((r => r > 100 ? 100 : r)(fam_risk.reduce((a, b) => a + b, 1) + pc)))(
              math.multiply(
                math.divide(this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1, this.riskQuiz.risks.length),
                100
              ));
          // const risk_pc = get_risk_pc.call(this);
          const risk_pc_as_s: string = (_risk_pc => {
            switch (true) {
              case math.smallerEq(_risk_pc, 25):
                return 'least';
              case math.smallerEq(_risk_pc, 50):
                return 'average';
              case math.smallerEq(_risk_pc, 75):
                return '2nd greatest';
              case math.larger(_risk_pc, 75):
              default:
                return 'greatest';
            }
          })(risk_pc);
          /*math.format(risk_pc, 6)*/
          /*(fmt_s => `${fmt_s.lastIndexOf('.') > -1 && fmt_s.length > 3 ? fmt_s.slice(0, -1) : risk_pc}%`)(
           math.format(risk_pc, 6)
           )*/
          this.most_at_risk =
            `${this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1} / ${this.riskQuiz.risks.length}`;
          this.riskQuiz.relative_risks = calc_relative_risk(this.riskStatsService.risk_json, this.riskQuiz.riskQuiz);
          this.show_treemap = true;

          this.gaugeView(risk_pc, risk_pc_as_s);
          this.pieAdvView(this.riskQuiz.multiplicative_risks);

          this.riskQuiz.client_risk = +risk_pc.toPrecision(4);

          this.recommendation = 'We recommend you see an eye-health professional ';
          if (risk_pc <= 25) {
            this.recommendation += ' in the next two years.';
            this.recommendation_subtitle = 'Unless you\'ve seen one in the last 2 years';
          } else if (risk_pc <= 50) {
            this.recommendation += ' in the next year.';
            this.recommendation_subtitle = 'Unless you\'ve seen one in the last year';
          } else if (risk_pc <= 75) {
            this.recommendation += ' in the next 6 months.';
            this.recommendation_subtitle = 'Unless you\'ve seen one recently.';
          } else {
            this.recommendation += ' ASAP.';
            this.recommendation_subtitle = 'Unless you\'ve seen one recently.';
          }

          if (this.id == null)
            this.riskResService
              .create(this.riskQuiz.toJSON())
              .subscribe(r => {
                this.id = r.id;
                this.share_url = this.idWithUrl()
              }, console.error);
          else this.share_url = this.idWithUrl();
        },
        console.error
      );
  }

  private gaugeView(risk_pc: number, risk_pc_as_s: string) {
    this.progressGraph.labels.push(
      new GaugeLabel({
        color: colours.white,
        text: 'risk',
        x: 0,
        y: 20,
        fontSize: '1em'
      }),
      new GaugeLabel({
        color: numToColour(risk_pc),
        text: risk_pc_as_s,
        x: 0,
        y: 0,
        fontSize: '2em'
      })
    );
    this.progressGraph.segments.push(
      new GaugeSegment({
        value: risk_pc,
        color: numToColour(risk_pc),
        borderWidth: 20
      })
    );
    this.gauge = true;
  }

  private pieAdvView(multiplicative_risks: IMultiplicativeRisks) {
    this.pieAdvData = Object
      .keys(multiplicative_risks)
      .map(k => ({ name: k, value: multiplicative_risks[k] }))
      .filter(o => o.value > 1);
    this.show_pie_adv = this.added_risk = this.riskQuiz.riskQuiz.sibling || this.riskQuiz.riskQuiz.parent;
  }

  labelFormat = (label: {
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
    if (this.treemap_legend.findIndex(o => o.color === label.data.fill) < 0)
      this.treemap_legend.push({
        color: label.data.fill,
        name: label.data.data.name,
        value: label.data.data.value
      });
    this.treemap_legend.sort((a, b) => a.value < b.value as any);
    return m[label.data.data.name] || label.data.data.name;
  };
}
