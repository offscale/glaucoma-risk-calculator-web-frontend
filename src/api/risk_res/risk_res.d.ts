export interface IRiskRes extends IRiskResBase {
  id?: number;
  updatedAt: Date;
}

export interface IRiskResBase {
  age: number;
  gender: string;
  ethnicity: string;
  study: string;
  myopia?: boolean;
  diabetes?: boolean;
  other_info?: string;
  createdAt?: string | Date;
  client_risk: number;
  sibling?: boolean; // sibling has glaucoma?
  parent?: boolean;  // parent has glaucoma?
}
