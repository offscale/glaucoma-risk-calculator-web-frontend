import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GaugeLabel, GaugeSegment } from 'ng-gauge';
import { familial_risks_from_study, IRiskJson, s_col_to_s } from 'glaucoma-risk-calculator-engine';
import { RiskStatsService } from 'app/api/risk_stats/risk-stats.service';
import { RiskQuiz } from '../risk-quiz-form/risk-quiz.model';
import { RiskResService } from '../api/risk_res/risk_res.service';
import { MsAuthService } from '../ms-auth/ms-auth.service';


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
export class RiskQuizFormSubmittedComponent implements OnInit, AfterViewInit {
  @Input() riskQuiz: RiskQuiz;
  @Input() submitted: boolean = false;
  most_at_risk: string = '';
  isCollapsed: boolean = true;
  id: number = undefined;
  share_url: string;
  recommendation: string;

  colors = {
    indigo: '#14143e',
    pink: '#fd1c49',
    orange: '#ff6e00',
    yellow: '#f0c800',
    mint: '#00efab',
    cyan: '#05d1ff',
    purple: '#841386',
    white: '#fff'
  };

  progressGraph = {
    bgRadius: 60,
    bgColor: this.colors.indigo,
    rounded: false,
    reverse: false,
    animationSecs: 1,
    labels: [],
    segments: []
  };

  @Output() submittedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private riskStatsService: RiskStatsService,
              private riskResService: RiskResService) {
  }

  redo() {
    this.submittedChange.emit(false);
    this.router.navigate(['/']).catch(console.error);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.submitted)
      this.prepareView();
    else
      this.route.params
        .switchMap((params: Params) => {
          this.id = +params['id'];
          return this.riskResService.read(this.id)
        })
        .subscribe((riskQuiz: any) => {
          this.riskQuiz = riskQuiz;
          this.submitted = true;
          this.prepareView()
        });
  }

  private prepareView() {
    if (!(this.riskQuiz instanceof RiskQuiz))
      this.riskQuiz = new RiskQuiz(this.riskQuiz['age'], this.riskQuiz['gender'], this.riskQuiz['ethnicity'], this.riskQuiz['sibling'], this.riskQuiz['parent']);
    this.riskStatsService.read('latest').subscribe(
      content => {
        this.riskStatsService.risk_stats = content.risk_json as IRiskJson;
        this.riskQuiz.calcRisk(this.riskStatsService.risk_stats);
        this.riskStatsService.risk = this.riskQuiz.risk;
        this.riskQuiz.ref = this.riskStatsService.risk_stats.studies[s_col_to_s(this.riskQuiz.ethnicity)].ref;
        //this.riskQuiz.prepareRef();

        const fam_risk = familial_risks_from_study(this.riskStatsService.risk_stats, this.riskQuiz.toJSON());
        const risk_pc =
          (pc => ((r => r > 100 ? 100 : r)(fam_risk.reduce((a, b) => a + b, 1) + pc)))(math.multiply(
            math.divide(this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1, this.riskQuiz.risks.length), 100
          ));
        //const risk_pc = get_risk_pc.call(this);
        const risk_pc_as_s: string = math.format(risk_pc, 6)
          /*(fmt_s => `${fmt_s.lastIndexOf('.') > -1 && fmt_s.length > 3 ? fmt_s.slice(0, -1) : risk_pc}%`)(
           math.format(risk_pc, 6)
           )*/;
        this.most_at_risk =
          `${this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1} / ${this.riskQuiz.risks.length}`;

        const color = (() => {
          if (math.compare(risk_pc, 25) < 1)
            return this.colors.cyan;
          else if (math.compare(risk_pc, 50) < 1)
            return this.colors.mint;
          else if (math.compare(risk_pc, 75) < 1)
            return this.colors.orange;
          return this.colors.pink;
        })();
        this.progressGraph.labels.push(
          new GaugeLabel({
            color: this.colors.white,
            text: 'most at risk',
            x: 0,
            y: 20,
            fontSize: '1em'
          }),
          new GaugeLabel({
            color: color,
            text: risk_pc_as_s,
            x: 0,
            y: 0,
            fontSize: '2em'
          })
        );
        this.progressGraph.segments.push(new GaugeSegment({
          value: risk_pc as number,
          color: color,
          borderWidth: 20
        }));

        this.riskQuiz.client_risk = risk_pc.valueOf();

        this.recommendation = 'See an eye-health professional ';
        if (risk_pc <= 25)
          this.recommendation += ' in the next two years.';
        else if (risk_pc <= 50)
          this.recommendation += ' in the next year.';
        else if (risk_pc <= 75)
          this.recommendation += ' in the next 6 months.';
        else
          this.recommendation += ' ASAP.';

        if (this.id === undefined)
          this.riskResService.create(this.riskQuiz).subscribe(r => {
            this.id = r.id;
            this.share_url = this.idWithUrl()
          }, console.error);
        else this.share_url = this.idWithUrl();
      },
      console.error
    );
  }

  public toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  parseRef(ref: IItem) {
    console.info('ref keys =', Object.keys(ref));
    return JSON.stringify(ref)
  }

  idWithUrl(): string {
    return `${MsAuthService.getHostOrigin()}/results/${this.id}`;
  }
}
