export interface ITemplate extends ITemplateBase {
  id?: number;
  updatedAt: Date;
}

export interface ITemplateBase {
  contents: string;
  createdAt: Date | string;
  kind?: string;
}

export interface ITemplateBatch {
  templates: ITemplate[]
}
