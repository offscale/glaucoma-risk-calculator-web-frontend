import { TestBed, inject } from '@angular/core/testing';
import { MsAuthService } from './ms-auth.service';

describe('MsAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsAuthService]
    });
  });

  it('should ...', inject([MsAuthService], (service: MsAuthService) => {
    expect(service).toBeTruthy();
  }));
});
