export interface IRiskRes extends IRiskResBase {
  id?: number;
  updatedAt: Date;
}

export interface IRiskResBase {
  risk_json?: string | {} | JSON;
  createdAt: Date | string;
}
