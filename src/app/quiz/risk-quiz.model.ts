import {
  calc_default_multiplicative_risks,
  ethnicity2study,
  Gender,
  IInput,
  IMultiplicativeRisks,
  IRelativeRisk,
  IRiskJson,
  risk_from_study,
  risks_from_study,
  Study
} from 'glaucoma-risk-calculator-engine';

// import { IItem } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';

export interface IRiskQuiz extends IInput {
  ethnicity: string;
  myopia: boolean;
  diabetes: boolean;
  study: Study;
  age: number;
  gender: Gender;
  sibling: boolean;
  parent: boolean;
}

interface IIRiskQuiz {
  riskQuiz: IRiskQuiz;
}

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

export class RiskQuiz implements IIRiskQuiz {
  public risk: number;
  public relativeRisks: IRelativeRisk;
  public clientRisk: number;
  // public riskLength: number;
  public risks: number[];
  // public ref: Array<IItem>;
  public study: Study;
  public multiplicativeRisks: IMultiplicativeRisks;

  constructor(public riskQuiz: IRiskQuiz) {
  }

  calcRisk(riskJson: IRiskJson) {
    this.study = ethnicity2study(riskJson)[this.riskQuiz.ethnicity];
    const input: IInput = {
      study: this.study,
      age: this.riskQuiz.age,
      gender: this.riskQuiz.gender as any
    } as IInput;
    this.risk = +risk_from_study(riskJson, input).toPrecision(4);
    this.risks = risks_from_study(riskJson, input);
    this.multiplicativeRisks = calc_default_multiplicative_risks(riskJson, {
      age: this.riskQuiz.age,
      diabetes: this.riskQuiz.diabetes,
      myopia: this.riskQuiz.myopia,
      family_history: this.riskQuiz.sibling || this.riskQuiz.parent
    });
  }

  toJSON() {
    return {
      age: this.riskQuiz.age,
      gender: this.riskQuiz.gender,
      ethnicity: this.riskQuiz.ethnicity,
      study: this.study,
      parent: this.riskQuiz.parent || false,
      sibling: this.riskQuiz.sibling || false,
      myopia: this.riskQuiz.myopia || false,
      diabetes: this.riskQuiz.diabetes || false,
      client_risk: this.clientRisk
    };
  }
}
