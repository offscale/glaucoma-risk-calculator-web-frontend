import { IRiskJson } from 'glaucoma-risk-calculator-engine';

export interface IRiskStats extends IRiskStatsBase {
  id?: number;
  updatedAt: Date;
}

export interface IRiskStatsBase {
  risk_json?: string | {} | JSON | IRiskJson;
  createdAt: Date | string;
}
