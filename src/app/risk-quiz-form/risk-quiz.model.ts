import { IInput, IRiskJson, risk_from_study, risks_from_study, s_col_to_s } from 'glaucoma-risk-quiz-engine';
import { IItem } from '../risk-quiz-form-submitted/risk-quiz-form-submitted.component';

export interface IRiskQuiz {
  age: number;
  gender: string;
  ethnicity: string;
  ocular_disease_history?: string[];
  ocular_surgery_history?: string[];
  other_info?: string;
  family_history_of_glaucoma?: string[];
  email?: string;
  sibling?: boolean; // sibling has glaucoma?
  parent?: boolean;  // parent has glaucoma?
}

export class RiskQuiz implements IRiskQuiz {
  public risk: number;
  public client_risk: number;
  public riskLength: number;
  public risks: number[];
  public ref: Array<IItem>;

  constructor(public age: number,
              public gender: string,
              public ethnicity: string,
              public sibling?: boolean,
              public parent?: boolean,
              public ocular_disease_history?: string[],
              public ocular_surgery_history?: string[],
              public other_info?: string,
              public email?: string) {
  }

  calcRisk(risk_json: IRiskJson) {
    const ethnicity = s_col_to_s(this.ethnicity);
    const input: IInput = {
      study: ethnicity,
      age: this.age,
      gender: this.gender
    };
    this.risk = risk_from_study(risk_json, input);
    this.risks = risks_from_study(risk_json, input);
  }

  toJSON() {
    return {
      age: this.age,
      gender: this.gender,
      ethnicity: this.ethnicity,
      study: s_col_to_s(this.ethnicity),
      parent: this.parent,
      sibling: this.sibling,
      client_risk: this.client_risk
    }
  }
}
