import htmlToAmp from 'html-to-amp';

htmlToAmp('<p>beep boop</p>', (err, amp) => {
  if (err) {
    throw err;
  }
  // do something with it
});

// can also return a promises
htmlToAmp('<p>beep boop</p>').then(amp => {
  // do something with it
});
