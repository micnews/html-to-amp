import test from 'ava';
import 'babel-core/register';
import setupHtmlToAmp from './lib';

const htmlToAmp = setupHtmlToAmp();

test('simple input', t => {
  const html = 'foo bar';

  return htmlToAmp(html)
    .then(amp => { t.is(amp, '<article><p>foo bar</p></article>'); });
});
