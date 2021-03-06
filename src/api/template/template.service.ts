import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ITemplate, ITemplateBase, ITemplateBatch } from './template.d';


@Injectable()
export class TemplateService {
  public templates: Map<string, ITemplateBase> = new Map();  // silly cache

  constructor(private http: HttpClient) {}

  public hasTpl(kind: string = 'email'): boolean {
    return this.templates.has(kind) && this.templates.get(kind).contents
      && this.templates.get(kind).contents.length > 0;
  }

  public setTpl(contents: string, kind: string = 'email') {
    this.hasTpl(kind) ?
      this.templates.get(kind).contents = contents
      : this.templates.set(kind, { contents, createdAt: new Date().toISOString() });
  }

  public getTpl(kind: string = 'email'): string {
    return this.templates.has(kind) ? this.templates.get(kind).contents : void 0;
  }

  create(template: ITemplateBase): Observable<ITemplate> {
    return this.http.post<ITemplate>('/api/template', template);
  }

  createBatch(newTemplates: ITemplateBase[]): Observable<ITemplateBatch> {
    return this.http.post<ITemplateBatch>('/api/templates', { templates: newTemplates });
  }

  read(createdAt: string | 'latest' | Date, kind: string = 'email'): Observable<ITemplate> {
    return this.http.get<ITemplate>(`/api/template/${createdAt}_${kind}`);
  }

  readBatch(): Observable<{templates: ITemplate[]}> {
    return this.http.get<{templates: ITemplate[]}>('/api/templates/latest')
      .pipe(map(templates => {
          templates.templates.forEach(template =>
            this.templates.set(template.kind, template)
          );
          return templates;
        }),
        catchError(error =>
          console.error(error) as any || throwError(error)
        )) as Observable<{templates: ITemplate[]}>;
  }

  update(prevRecord: ITemplate, newRecord: ITemplateBase): Observable<ITemplate> {
    return this.http.put<ITemplate>(`/api/template/${prevRecord.createdAt}`, newRecord);
  }

  destroy(createdAt: string | Date, kind: string = 'email'): Observable<{}> {
    return this.http.delete<ITemplate>(`/api/template/${createdAt}_${kind}`);
  }
}
