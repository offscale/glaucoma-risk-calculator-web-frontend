/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';

import { RiskStatsService } from './risk-stats.service';

describe('RiskStatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RiskStatsService]
    });
  });

  it('should ...', inject([RiskStatsService], (service: RiskStatsService) => {
    expect(service).toBeTruthy();
  }));
});
