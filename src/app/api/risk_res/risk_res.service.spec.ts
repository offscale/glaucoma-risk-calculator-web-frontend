/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RiskResService } from './risk_res.service';

describe('RiskResService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RiskResService]
    });
  });

  it('should ...', inject([RiskResService], (service: RiskResService) => {
    expect(service).toBeTruthy();
  }));
});
