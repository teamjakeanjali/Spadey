const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const request = require('request');
const download = require('download');
require('dotenv').config();

// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.TONEANALYZER_USERNAME,
  password: process.env.TONEANALYZER_PASSWORD,
  version: '2017-09-21'
});

const uploadWebmFile = () => {
  console.log('STEP 1');
  const dataString = {
    apikey: process.env.CONVERTIO_API_KEY,
    input: 'upload',
    filename: './assets/audio.webm',
    outputformat: 'flac'
  };

  var options = {
    url: 'http://api.convertio.co/convert',
    method: 'POST',
    body: dataString,
    json: true
  };

  let fileId;

  function callback(error, response) {
    if (!error && response.statusCode == 200) {
      let body = response.body;
      fileId = body.data.id;
      directUpload(fileId);
    }
  }

  request(options, callback);
};

const directUpload = id => {
  var options = {
    url: `http://api.convertio.co/convert/${id}/audio.webm`,
    method: 'PUT'
  };

  function callback(error, response) {
    if (error) {
      console.log(error);
    } else {
      getFlacFile(id);
    }
  }

  fs.createReadStream('./assets/audio.webm').pipe(request(options, callback));
};

const getFlacFile = id => {
  var options = {
    url: `http://api.convertio.co/convert/${id}/status`,
    json: true
  };

  function callback(error, response) {
    if (!error && response.statusCode == 200) {
      let url = response.body.data.output.url;
      downloadFile(url);
    }
  }

  request(options, callback);
};

const downloadFile = link => {
  download(link)
    .then(data => {
      fs.writeFileSync('./assets/audio.flac', data);
    })
    .then(() => {
      analyzeSpeech();
    });
};

const analyzeSpeech = () => {
  console.log('step 5');
  const client = new speech.SpeechClient();
  // configuration needed for sync speech recognize
  const encoding = 'FLAC';
  const sampleRateHertz = 48000;
  const filename = './assets/audio.flac';
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

  // // Detects speech in the audio file
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
      // });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
};
module.exports.uploadWebmFile = uploadWebmFile;

// getFlacFile('c530ab476c561e63b4825594c0f66002');
