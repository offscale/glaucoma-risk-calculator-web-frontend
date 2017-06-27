import { GlaucomaRiskCalculatorWebFrontendPage } from './app.po';

describe('glaucoma-risk-calculator-web-frontend App', () => {
  let page: GlaucomaRiskCalculatorWebFrontendPage;

  beforeEach(() => {
    page = new GlaucomaRiskCalculatorWebFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    page.getParagraphText().then(msg => expect(msg).toEqual('Welcome to app!!'));
  });
});
