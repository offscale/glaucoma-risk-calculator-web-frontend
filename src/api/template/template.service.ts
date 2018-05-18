import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ITemplate, ITemplateBase, ITemplateBatch } from './template.d';
import { AlertsService } from '../../app/alerts/alerts.service';


@Injectable()
export class TemplateService {
  public templates: Map<string, ITemplateBase> = new Map();  // silly cache

  constructor(private http: HttpClient,
              private alertsService: AlertsService) {
  }

  public hasTpl(kind: string = 'email'): boolean {
    return this.templates.has(kind) && this.templates.get(kind).contents
      && this.templates.get(kind).contents.length > 0;
  }

  public setTpl(contents: string, kind: string = 'email') {
    this.hasTpl(kind) ?
      this.templates.get(kind).contents = contents
      : this.templates.set(kind, { contents: contents, createdAt: new Date().toISOString() });
  }

  public getTpl(kind: string = 'email'): string {
    return this.templates.has(kind) ? this.templates.get(kind).contents : void 0;
  }

  create(template: ITemplateBase): Observable<ITemplate> {
    return this.http.post<ITemplate>('/api/template', template);
  }

  createBatch(new_templates: ITemplateBase[]): Observable<ITemplateBatch> {
    return this.http.post<ITemplateBatch>('/api/templates', { templates: new_templates });
  }

  read(createdAt: string | 'latest' | Date, kind: string = 'email'): Observable<ITemplate> {
    return this.http.get<ITemplate>(`/api/template/${createdAt}_${kind}`)
  }

  readBatch(): Observable<{templates: ITemplate[]}> {
    return this.http.get<{templates: ITemplate[]}>('/api/templates/latest')
      .map(templates => {
        templates.templates.forEach(template =>
          this.templates.set(template.kind, template)
        );
        return templates;
      }).catch(error =>
        this.alertsService.add(error) || Observable.throw(error)
      );
  }

  update(prevRecord: ITemplate, newRecord: ITemplateBase): Observable<ITemplate> {
    return this.http.put<ITemplate>(`/api/template/${prevRecord.createdAt}`, newRecord)
  }

  destroy(createdAt: string | Date, kind: string = 'email'): Observable<{}> {
    return this.http.delete<ITemplate>(`/api/template/${createdAt}_${kind}`)
  }
}
