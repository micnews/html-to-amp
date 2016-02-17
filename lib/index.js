import setupHtmlToArticleJson from 'html-to-article-json';
import articleJsonToAmp from 'article-json-to-amp';
import Promise from 'pinkie-promise';
import imageSize from 'request-image-size';

const addDimensions = (json) => {
  return Promise.all(
    json.map(row => {
      if (row.embedType !== 'image' || (row.width && row.height) || !row.src) {
        return row;
      }

      return new Promise((resolve, reject) => {
        imageSize(row.src, (err, dimensions) => {
          if (err) {
            reject(err);
          } else {
            row.width = dimensions.width;
            row.height = dimensions.height;
            resolve(row);
          }
        });
      });
    })
  );
};

module.exports = () => {
  const htmlToArticleJson = setupHtmlToArticleJson();

  const htmlToAmp = html => Promise.resolve(htmlToArticleJson(html))
    .then(json => addDimensions(json))
    .then(json => Promise.resolve(articleJsonToAmp(json)));

  return (html, cb) => {
    if (cb) {
      htmlToAmp(html).then(amp => cb(null, amp), err => cb(err));
    } else {
      return htmlToAmp(html);
    }
  };
};
