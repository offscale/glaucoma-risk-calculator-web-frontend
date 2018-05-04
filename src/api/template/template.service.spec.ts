/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { TemplateService } from './template.service';

describe('TemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateService]
    });
  });

  it('should ...', inject([TemplateService], (service: TemplateService) => {
    expect(service).toBeTruthy();
  }));
});
