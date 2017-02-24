/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmailTplService } from './email-tpl.service';

describe('EmailTplService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailTplService]
    });
  });

  it('should ...', inject([EmailTplService], (service: EmailTplService) => {
    expect(service).toBeTruthy();
  }));
});
