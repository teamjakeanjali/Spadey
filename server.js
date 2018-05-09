const http = require('http');
const express = require('express');
const app = express();
const isDevMode = process.env.NODE_ENV === 'development';
const request = require('request');
var SoxCommand = require('sox-audio');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var command = SoxCommand();
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;

app.use(require('morgan')('short'));

(function initWebpack() {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/common.config');
  const compiler = webpack(webpackConfig);

  app.use(
    require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    })
  );

  app.use(express.static(__dirname + '/'));
})();

let toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  url: 'https://gateway-fra.watsonplatform.net/tone-analyzer/api'
});

const analyzeText = text => {
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

const convertAudio = inputStream => {
  // use sox to convert blob of .wav files to .flac file

  command
    .input(inputStream)
    .inputSampleRate(1600)
    .inputEncoding('signed')
    .inputBits(16)
    .inputChannels(2)
    .inputFileType('wav');

  command
    .output('./assets/converted.flac')
    .outputSampleRate(44100)
    .outputEncoding('FLAC')
    .outputBits(16)
    .outputChannels(1)
    .outputFileType('flac');
  command.on('prepare', function(args) {
    console.log('Preparing sox command with args ' + args.join(' '));
  });

  command.on('start', function(commandLine) {
    console.log('Spawned sox with command ' + commandLine);
  });

  command.on('progress', function(progress) {
    console.log('Processing progress: ', progress);
  });

  command.on('error', function(err, stdout, stderr) {
    console.log('Cannot process audio: ' + err.message);
    console.log('Sox Command Stdout: ', stdout);
    console.log('Sox Command Stderr: ', stderr);
  });

  command.on('end', function() {
    console.log('Sox command succeeded!');
  });

  command.run();
};

app.post('/audio', function(req, res) {
  // convertAudio('./assets/test.wav');
  // function syncRecognize(filename, encoding, sampleRateHertz, languageCode) {
  // [START speech_sync_recognize]
  // Imports the Google Cloud client library

  // Creates a client
  const client = new speech.SpeechClient();

  // configuration needed for sync speech recognize
  const filename = './assets/test1.flac';
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

  const request = {
    config: config,
    audio: audio
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log('Transcription: ', transcription);
      analyzeText(transcription);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // [END speech_sync_recognize]
  // }
});

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});
