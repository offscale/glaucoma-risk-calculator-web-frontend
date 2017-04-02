import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { s_col_to_s } from 'glaucoma-risk-quiz-engine';
import { RiskStatsService } from 'app/api/risk_stats/risk_stats/risk-stats.service';
import { RiskQuiz } from '../risk-quiz/risk-quiz.model';
import { GaugeLabel, GaugeSegment } from 'ng2-kw-gauge';

@Component({
  selector: 'app-risk-quiz-form-submitted',
  templateUrl: './risk-quiz-form-submitted.component.html',
  styleUrls: ['./risk-quiz-form-submitted.component.css']
})
export class RiskQuizFormSubmittedComponent implements OnInit, AfterViewInit {
  @Input() riskQuiz: RiskQuiz;
  most_at_risk: string = '';
  @Input() submitted: boolean = false;
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

  constructor(private riskStatsService: RiskStatsService) {
    GaugeSegment
    GaugeLabel
  }

  onClick() {
    this.submittedChange.emit(false);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!(this.riskQuiz instanceof RiskQuiz))
      this.riskQuiz = new RiskQuiz(this.riskQuiz['age'], this.riskQuiz['gender'], this.riskQuiz['ethnicity']);
    this.riskStatsService.read('latest').subscribe(
      content => {
        this.riskStatsService.risk_stats = content.risk_json;
        this.riskQuiz.calcRisk(this.riskStatsService.risk_stats);
        this.riskStatsService.risk = this.riskQuiz.risk;
        this.riskQuiz.ref = this.riskStatsService.risk_stats.studies[s_col_to_s(this.riskQuiz.ethnicity)].ref;
        this.riskQuiz.prepareRef();

        const risk_pc = math.multiply(
          math.divide(this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1, this.riskQuiz.risks.length), 100
        );
        this.most_at_risk =
          `${this.riskQuiz.risks.lastIndexOf(this.riskQuiz.risk) + 1} / ${this.riskQuiz.risks.length}`;

        const color = math.compare(risk_pc, 50) > -1 ? this.colors.orange : this.colors.mint;
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
            text: `${math.format(risk_pc, 4)}%`,
            x: 0,
            y: 0,
            fontSize: '2em'
          })
        );
        this.progressGraph.segments.push(new GaugeSegment({
          value: risk_pc,
          color: color,
          borderWidth: 20
        }));
      },
      console.error
    );
  }

  parseRef(ref: {}) {
    return JSON.stringify(ref)
  }
}
