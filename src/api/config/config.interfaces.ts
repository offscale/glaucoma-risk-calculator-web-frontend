export interface IConfig extends IConfigBase {
  id?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface IConfigBase {
  state?: string;
  id_token?: string;
  access_token?: string;
  from?: string;
  session_state?: string;
  client_id: string;
  tenant_id: string;
}
