import { IRiskJson, IInput, risk_from_study, risks_from_study, s_col_to_s } from 'glaucoma-risk-quiz-engine';
import { CSL } from 'citeproc';

export interface IRiskQuiz {
  age: number;
  gender: string;
  ethnicity: string;
  ocular_disease_history?: string[];
  ocular_surgery_history?: string[];
  other_info?: string;
  family_history_of_glaucoma?: string[];
  email?: string;
}

export class RiskQuiz implements IRiskQuiz {
  public risk: number;
  public riskLength: number;
  public risks: number[];
  public ref: any | any[];//|Array<any>;

  constructor(public age: number,
              public gender: string,
              public ethnicity: string,
              public ocular_disease_history?: string[],
              public ocular_surgery_history?: string[],
              public other_info?: string,
              public family_history_of_glaucoma?: string[],
              public email?: string) {
  }

  calcRisk(risk_json: IRiskJson) {
    console.info('calcRisk::risk_json =', risk_json);
    const ethnicity = s_col_to_s(this.ethnicity);
    const input: IInput = {
      study: ethnicity,
      age: this.age,
      gender: this.gender
    };
    this.risk = risk_from_study(risk_json, input);
    this.risks = risks_from_study(risk_json, input);
  }

  prepareRef() {
    const citations = {};
    const itemIDs = [];
    console.info('this.ref =', this.ref);
    for (let i = 0, ilen = this.ref.length; i < ilen; i++) {
      const item = this.ref[i];
      console.info('item =', item);
      if (!item.issued) continue;
      if (item.URL) delete item.URL;
      const id = item.id;
      citations[id] = item;
      itemIDs.push(id);
    }

    const citeprocSys = {
      retrieveLocale: function (lang) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-' + lang + '.xml', false);
        xhr.send(null);
        return xhr.responseText;
      },
      retrieveItem: function (id) {
        return citations[id];
      }
    };

    function getProcessor() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/ieee-with-url.csl', //'https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl',
        false);
      xhr.send(null);
      const styleAsText = xhr.responseText;
      return new CSL.Engine(citeprocSys, styleAsText);
    }

    function processorOutput() {
      const ret = '';
      const citeproc = getProcessor();
      citeproc.updateItems(itemIDs);
      const result = citeproc.makeBibliography();
      return result[1].join('\n');
    }
  }
}
