#!/usr/bin/env node

'use strict';

require('babel-core/register');
require('../')().listen(8888, function () {
  console.log('example server listening on http://localhost:8888');
  console.log('visit a page, for example http://localhost:8888/http://mic.com/articles/133819/everything-you-missed-from-the-gop-debate-you-didn-t-watch-because-trump-wasn-t-there');
});
