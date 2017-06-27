// import { CSL } from 'citeproc';

class CitationHandler {
  ref: Array<{ URL: string, issued: boolean, id: number }>;

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

    const getProcessor = (): { updateItems(ids): void, makeBibliography(): void } => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://raw.githubusercontent.com/citation-style-language/styles/master/ieee-with-url.csl', // 'https://raw.githubusercontent.com/citation-style-language/styles/master/' + styleID + '.csl',
        false);
      xhr.send(null);
      const styleAsText = xhr.responseText;
      return { updateItems: (ids) => null, makeBibliography: () => null }
      // return new CSL.Engine(citeprocSys, styleAsText);
    };

    const processorOutput = () => {
      const ret = '';
      const citeproc: { updateItems(ids): void, makeBibliography(): void } = getProcessor();
      citeproc.updateItems(itemIDs);
      const result = citeproc.makeBibliography();
      return result[1].join('\n');
    };
  }
}
