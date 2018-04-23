export interface IAlert {
  readonly type: 'success' | 'info' | 'warning' | 'danger' | 'stock';
  readonly msg: string;
  readonly closable?: boolean;
  readonly dismissOnTimeout?: number;
}

export type TAlert = {error: string, error_message: string} | {code: number, message: string} | {message: string} | IAlert;
