import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISurvey, ISurveyBase } from './survey';


@Injectable()
export class SurveyService {
  public resultQuizSucceeded = false;
  private innerSurvey: ISurvey;

  constructor(private http: HttpClient) { }

  get survey(): ISurvey {
    if (this.innerSurvey != null) {
      return this.innerSurvey;
    }
    const thisSurvey = localStorage.getItem('survey');
    if (thisSurvey != null) {
      this.innerSurvey = JSON.parse(thisSurvey);
    }
    return this.innerSurvey;
  }

  set survey(thisSurvey: ISurvey) {
    localStorage.setItem('survey', JSON.stringify(thisSurvey));
    this.innerSurvey = thisSurvey;
  }

  create(survey: ISurvey): Observable<ISurvey> {
    return this.http
      .post<ISurvey>('/api/survey', survey)
      .pipe(map(surveyObj => this.survey = surveyObj));
  }

  addEmail(email: string): Observable<{email: string}> {
    return this.http.post<{email: string}>('/api/email', { email });
  }

  read(id: number): Observable<ISurvey> {
    return this.http.get<ISurvey>(`/api/survey/${id}`);
  }

  update(id: number, newRecord: Partial<ISurveyBase> & {email?: string}): Observable<ISurvey> {
    return this.http
      .put<ISurvey>(`/api/survey/${id}`, newRecord)
      .pipe(map(surveyObj => this.survey = surveyObj));
  }

  destroy(id: number): Observable<{}> {
    return this.http.delete<ISurvey>(`/api/survey/${id}`);
  }
}
