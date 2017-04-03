export interface IRiskStats extends IRiskStatsBase {
  id?: number;
  updatedAt: Date;
}

export interface IRiskStatsBase {
  risk_json?: string | {} | JSON;
  createdAt: Date | string;
}
