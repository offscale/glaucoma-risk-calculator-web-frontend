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
  ocular_disease_history?: string[];
  ocular_surgery_history?: string[];
  other_info?: string;
  family_history_of_glaucoma?: string[];
  email?: string;
  createdAt?: string | Date;
  client_risk: number;
  sibling?: boolean; // sibling has glaucoma?
  parent?: boolean;  // parent has glaucoma?
}
