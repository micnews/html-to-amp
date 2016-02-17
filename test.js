import test from 'ava';
import 'babel-core/register';
import setupHtmlToAmp from './lib';

const htmlToAmp = setupHtmlToAmp();

test('simple input', t => {
  const html = 'foo bar';

  return htmlToAmp(html)
    .then(amp => { t.is(amp, '<article><p>foo bar</p></article>'); });
});

test('handle image with size', t => {
  const html = '<img width="100" height="200" src="http://image.com" />';
  const expected = '<article><figure><amp-img width="100" height="200" layout="responsive" src="http://image.com"></amp-img></figure></article>';

  return htmlToAmp(html)
    .then(amp => { t.is(amp, expected); });
});
