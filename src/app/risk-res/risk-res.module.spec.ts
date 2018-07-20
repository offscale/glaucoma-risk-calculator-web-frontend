import { RiskResModule } from './risk-res.module';

describe('RiskResModule', () => {
  let riskResModule: RiskResModule;

  beforeEach(() => {
    riskResModule = new RiskResModule();
  });

  it('should create an instance', () => {
    expect(riskResModule).toBeTruthy();
  });
});
