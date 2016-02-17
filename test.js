import test from 'ava';
import 'babel-core/register';
import setupHtmlToAmp from './lib';
import http from 'http';
import Promise from 'pinkie-promise';

const htmlToAmp = setupHtmlToAmp();

test('simple input', t => {
  const html = 'foo bar';

  return htmlToAmp(html)
    .then(amp => { t.is(amp, '<article><p>foo bar</p></article>'); });
});

test('handle image with size', t => {
  const html = '<img width="100" height="200" src="http://image.com" />';
  const expected = '<article><figure><amp-img width="100" height="200" layout="responsive" src="http://image.com"></amp-img></figure></article>';

  return htmlToAmp(html).then(amp => { t.is(amp, expected); });
});

test('handle image without size', t => {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      res.end(new Buffer('R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64'));
    }).listen(0, () => {
      resolve(server.address().port);
    });
  }).then(port => {
    const expected = `<article><figure><amp-img width="1" height="1" layout="responsive" src="http://localhost:${port}/"></amp-img></figure></article>`;
    const html = `<img src="http://localhost:${port}/">`;
    return htmlToAmp(html).then(actual => { t.is(actual, expected); });
  });
});

test('handle image without src & without width/height', t => {
  const html = '<img />';
  const expected = '<article><figure></figure></article>';

  return htmlToAmp(html).then(amp => { t.is(amp, expected); });
});

test.cb('callback interface', t => {
  const html = '<img />';
  const expected = '<article><figure></figure></article>';

  return htmlToAmp(html, (err, amp) => {
    t.ifError(err);
    t.is(amp, expected);
    t.end();
  });
});
