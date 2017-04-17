export interface IRiskRes extends IRiskResBase {
  id?: number;
  updatedAt: Date;
}

export interface IRiskResBase {
  age: number;
  gender: string;
  ethnicity: string;
  client_risk: number;
  ocular_disease_history?: string[];
  ocular_surgery_history?: string[];
  other_info?: string;
  family_history_of_glaucoma?: string[];
  email?: string;
  createdAt?: string | Date;
}
