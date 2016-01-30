import {createServer} from 'http';
import fetch from 'node-fetch';
import setupHtmlToArticleJson from 'html-to-article-json';
import articleJsonToAmp from 'article-json-to-amp';
import imageSize from 'request-image-size';
import fs from 'then-fs';
import $ from 'whacko';

const htmlToArticleJson = setupHtmlToArticleJson();
const update = (row) => {
  const {type, embedType, width, height, src} = row;
  if (type === 'embed' && embedType === 'image' && src && (!width || !height)) {
    return new Promise(function (resolve, reject) {
      imageSize(src, function (err, dimensions) {
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
}

const getArticleJson = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  const article = $.load(html)('article').html() || html;

  const articleJson = htmlToArticleJson(article);

  await Promise.all(articleJson.map(update));
  return articleJson;
}

module.exports = () => {
  const server = createServer(async ({url}, res) => {
    try {
      const articleJson = await getArticleJson(url.slice(1));
      const tmpl = await fs.readFile(__dirname + '/index.html', 'utf8');
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
  });

  return server;
};
