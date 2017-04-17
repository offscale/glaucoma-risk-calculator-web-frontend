export interface IAlert {
  readonly type: 'success' | 'info' | 'warning' | 'danger' | 'stock';
  readonly msg: string;
  readonly closable?: boolean;
  readonly dismissOnTimeout?: number;
}
