import {createServer} from 'http';
import fetch from 'node-fetch';
import setupHtmlToArticleJson from 'html-to-article-json';
import articleJsonToAmp from 'article-json-to-amp';
import imageSize from 'request-image-size';
import fs from 'then-fs';
import $ from 'whacko';
import co from 'co';

const htmlToArticleJson = setupHtmlToArticleJson();
const update = (row) => {
  const {type, embedType, width, height, src} = row;
  if (type === 'embed' && embedType === 'image' && src && (!width || !height)) {
    return new Promise(function (resolve, reject) {
      imageSize(src, function (err, dimensions) {
        if (err) {
          return reject(err);
        }
        // skip err right now, doesn't matter

        console.log(dimensions);
        if (dimensions) {
          row.width = dimensions.width;
          row.height = dimensions.height;
        }
        resolve();
      });
    });
  }
};

const getArticleJson = co.wrap(function * (url) {
  const response = yield fetch(url);
  const html = yield response.text();
  const article = $.load(html)('article').html() || html;

  const articleJson = htmlToArticleJson(article);

  yield Promise.all(articleJson.map(update));
  return articleJson;
});

module.exports = () => {
  const server = createServer(co.wrap(function * ({url}, res) {
    try {
      const articleJson = yield getArticleJson(url.slice(1));
      const tmpl = yield fs.readFile(__dirname + '/index.html', 'utf8');
      const amp = articleJsonToAmp(articleJson);
      const html = new Buffer(tmpl.replace('{{body}}', amp));
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'content-length': html.length
      });
      res.end(html);
    } catch (err) {
      res.writeHeader(500);
      console.log(err && err.stack);
      res.end(err.message);
    }
  }));

  return server;
};
