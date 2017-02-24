export interface IEmailTpl extends IEmailTplBase {
  id?: number;
  updatedAt: Date;
}

export interface IEmailTplBase {
  tpl: string;
  createdAt: Date|string;
}
