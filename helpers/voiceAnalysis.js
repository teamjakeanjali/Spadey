const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: '1813adc9-1239-402c-9adb-7c5bfdb95664',
  password: 'pOt86kbRyD6A',
  version: '2017-09-21'
});

const speechAnalysis = () => {
  // Creates a client
  const client = new speech.SpeechClient();
  // configuration needed for sync speech recognize
  const filename = './assets/output.flac';
  const encoding = 'FLAC';
  const sampleRateHertz = 44100;
  const languageCode = 'en-US';
  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctuation: true
  };
  const audio = {
    content: fs.readFileSync(filename).toString('base64')
  };
  const speechRequest = {
    config: config,
    audio: audio
  };
  // Detects speech in the audio file
  client
    .recognize(speechRequest)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('TRANSCRIPTION', transcription);
    })
    .then(transcription => {
      //Set up tone analyzer params
      let params = {
        tone_input: { text: transcription },
        content_type: 'application/json'
      };
      // Do tone analysis
      //   toneAnalyzer.tone(params, function(error, response) {
      //     if (error) {
      //       console.log('error:', error);
      //     } else {
      //       // res.status(201).send({
      //       //   transcription: transcription,
      //       //   analysis: JSON.stringify(response)
      //       // });
      //     }
      //   });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
};

// module.exports = convertToFlac;
// module.exports = speechAnalysis;
