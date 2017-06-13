import {
  calc_default_multiplicative_risks,
  ethnicity2study, Gender,
  IInput,
  IMultiplicativeRisks,
  IRelativeRisk,
  IRiskJson,
  risk_from_study,
  risks_from_study,
  Study
} from 'glaucoma-risk-calculator-engine';
import { IItem } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';

export interface IRiskQuiz {
  age: number;
  gender: Gender;
  ethnicity: string;
  myopia: boolean;
  diabetes: boolean;
  study: Study;
  ocular_disease_history?: string[];
  ocular_surgery_history?: string[];
  other_info?: string;
  family_history_of_glaucoma?: string[];
  email?: string;
  sibling?: boolean; // sibling has glaucoma?
  parent?: boolean;  // parent has glaucoma?
}

interface IIRiskQuiz {
  riskQuiz: IRiskQuiz
}

export class RiskQuiz implements IIRiskQuiz {
  public risk: number;
  public relative_risks: IRelativeRisk;
  public client_risk: number;
  public riskLength: number;
  public risks: number[];
  public ref: Array<IItem>;
  public study: string;
  public multiplicative_risks: IMultiplicativeRisks;

  constructor(public riskQuiz: IRiskQuiz) {
  }

  calcRisk(risk_json: IRiskJson) {
    this.study = ethnicity2study(risk_json)[this.riskQuiz.ethnicity];
    const input: IInput = {
      study: this.study,
      age: this.riskQuiz.age,
      gender: this.riskQuiz.gender as any
    } as IInput;
    this.risk = risk_from_study(risk_json, input);
    this.risks = risks_from_study(risk_json, input);
    this.multiplicative_risks = calc_default_multiplicative_risks(risk_json, {
      age: this.riskQuiz.age,
      diabetes: this.riskQuiz.diabetes,
      myopia: this.riskQuiz.myopia,
      family_history: this.riskQuiz.sibling || this.riskQuiz.parent
    })
  }

  toJSON() {
    return {
      age: this.riskQuiz.age,
      gender: this.riskQuiz.gender,
      ethnicity: this.riskQuiz.ethnicity,
      study: this.study,
      parent: this.riskQuiz.parent,
      sibling: this.riskQuiz.sibling,
      myopia: this.riskQuiz.myopia,
      diabetes: this.riskQuiz.diabetes,
      client_risk: this.client_risk
    }
  }
}
