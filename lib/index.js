import setupHtmlToArticleJson from 'html-to-article-json';
import articleJsonToAmp from 'article-json-to-amp';
import Promise from 'pinkie-promise';

module.exports = () => {
  const htmlToArticleJson = setupHtmlToArticleJson();

  return html => Promise.resolve(htmlToArticleJson(html))
    .then(json => Promise.resolve(articleJsonToAmp(json)));
};
