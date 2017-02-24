import { GlaucomaRiskCalcWebFrontendPage } from './app.po';

describe('glaucoma-risk-calc-web-frontend App', function() {
  let page: GlaucomaRiskCalcWebFrontendPage;

  beforeEach(() => {
    page = new GlaucomaRiskCalcWebFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
