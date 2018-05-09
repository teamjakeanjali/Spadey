const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

let toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  username: '1813adc9-1239-402c-9adb-7c5bfdb95664',
  password: 'pOt86kbRyD6A',
  url: 'https://gateway-fra.watsonplatform.net/tone-analyzer/api'
});

module.exports.analyzeText = text => {
  console.log('made it in analyze');
  let params = {
    tone_input: { text: text },
    content_type: 'application/json'
  };

  toneAnalyzer.tone(params, function(error, response) {
    if (error) console.log('error:', error);
    else console.log(JSON.stringify(response, null, 2));
  });
};
