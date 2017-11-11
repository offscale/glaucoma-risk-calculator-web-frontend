import { browser, by, element } from 'protractor';

export class GlaucomaRiskCalculatorWebFrontendPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('glaucoma-risk-calculator h1')).getText();
  }
}
