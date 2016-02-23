import htmlToAmp from 'html-to-amp';

const html = `
  <p>beep booop</p>
  // if width and/or height is missing of an image the width & height will be
  //  read from the image (since width & height is required in AMP)
  <img src="http://example.com/image.jpg" />

  // youtube, twitter, instagram, facebook, vine & custom embeds are
  //  (through html-to-article-json) supported
  <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://t.co/kt1c5RWajI">https://t.co/kt1c5RWajI</a>’s <a href="https://twitter.com/david_bjorklund">@david_bjorklund</a> published 2 node modules to convert HTML snippets to <a href="https://twitter.com/AMPhtml">@amphtml</a><a href="https://t.co/yB5KMDijh6">https://t.co/yB5KMDijh6</a></p>&mdash; Malte Ubl (@cramforce) <a href="https://twitter.com/cramforce/status/697485294531145730">February 10, 2016</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
`;

// can be used with callbacks
htmlToAmp(html, (err, amp) => {
  if (err) {
    throw err;
  }
  // do something with it
});

// when second argument is ommited a promise is returned
htmlToAmp(html).then(amp => {
  // do something with it
});
