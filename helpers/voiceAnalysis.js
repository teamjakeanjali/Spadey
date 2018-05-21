const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const request = require('request');
const download = require('download');
const { updateMessage } = require('../database-pg/helper');
require('dotenv').config();

let globalRecordingId;

const uploadWebmFile = recordingId => {
  if (recordingId) {
    globalRecordingId = recordingId;
  }

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

  function callback(error, response) {
    console.log(response.body);
    if (error) {
      console.log(error);
    } else {
      let body = response.body;
      let fileId = body.data.id;
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
    }
    getFlacFile(id);
  }
  fs.createReadStream('./assets/audio.webm').pipe(request(options, callback));
};

const getFlacFile = id => {
  var options = {
    url: `http://api.convertio.co/convert/${id}/status`,
    json: true
  };

  function callback(error, response) {
    if (error) {
      console.log(error);
    } else {
      if (response.body.data.step === 'finish') {
        let url = response.body.data.output.url;
        downloadFile(url);
      } else {
        setTimeout(() => {
          getFlacFile(id);
        }, 5000);
      }
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
// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: process.env.TONEANALYZER_USERNAME,
  password: process.env.TONEANALYZER_PASSWORD,
  version: '2017-09-21'
});

const analyzeSpeech = () => {
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
      return response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    })
    .then(transcription => {
      //Set up tone analyzer params
      let params = {
        tone_input: { text: transcription },
        content_type: 'application/json'
      };
      // Do tone analysis
      toneAnalyzer.tone(params, function(error, response) {
        if (error) {
          console.log('error:', error);
        } else {
          updateMessage(
            globalRecordingId,
            transcription,
            JSON.stringify(response)
          );
        }
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
};

module.exports.uploadWebmFile = uploadWebmFile;
