export interface IEmailConf extends IEmailConfBase {
  id?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface IEmailConfBase {
  state?: string;
  id_token?: string;
  access_token?: string;
  from?: string;
  session_state?: string;
  client_id: string;
  tenant_id: string;
}
