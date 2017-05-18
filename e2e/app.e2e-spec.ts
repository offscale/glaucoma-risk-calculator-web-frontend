import { GlaucomaRiskCalcWebFrontendPage } from './app.po';

describe('glaucoma-risk-calculator-web-frontend App', () => {
  let page: GlaucomaRiskCalcWebFrontendPage;

  beforeEach(() => {
    page = new GlaucomaRiskCalcWebFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    page.getParagraphText().then(res => expect(res).toEqual('app works!'));
  });
});
