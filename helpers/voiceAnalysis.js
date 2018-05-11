const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const bodyParser = require('body-parser');
const sox = require('sox-stream');
// const buffer = require('buffer/').Buffer;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: '1813adc9-1239-402c-9adb-7c5bfdb95664',
  password: 'pOt86kbRyD6A',
  version: '2017-09-21'
});

let readStream;

router.post('/audio', function(req, res) {
  // req.on('readable', function() {
  //   console.log('req.read', req.read());
  //   readStream = req.read();
  // });
  console.log(req.req);
  let src = fs.createReadStream(req);
  console.log(src);
  const transcode = sox({
    output: {
      bits: 16,
      rate: 44100,
      chanels: 1,
      type: 'flac'
    }
  });
  let destination = fs.createWriteStream('song.flac');
  src.pipe(transcode).pipe(destination);

  transcode.on('error', err => console.log('err', err));

  // var command = SoxCommand(readStream)
  //   .outputFileType('flac')
  //   .outputSampleRate('44.1k');

  // command.on('start', function(commandLine) {
  //   console.log('Spawned sox with command ' + commandLine);
  // });
  // command.on('progress', function(progress) {
  //   console.log('Processing progress: ', progress);
  // });
  // command.on('error', function(err, stdout, stderr) {
  //   console.log('Cannot process audio: ' + err.message);
  //   console.log('Sox Command Stdout: ', stdout);
  //   console.log('Sox Command Stderr: ', stderr);
  // });
  // command.on('end', function() {
  //   console.log('Sox command succeeded!');
  // });
  // command.run();
  // Creates a client
  const client = new speech.SpeechClient();

  // let flacRecording = multipart.Parse(recording, boundary);
  // configuration needed for sync speech recognize
  //'./assets/test.flac'
  const filename = './assets/test.flac';
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
  client.recognize(request).then(data => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(transcription);
  });
  //     .then(transcription => {
  //       //Set up tone analyzer params
  //       let params = {
  //         tone_input: { text: transcription },
  //         content_type: 'application/json'
  //       };

  //       //Do tone analysis
  //       // toneAnalyzer.tone(params, function(error, response) {
  //       //   if (error) {
  //       //     console.log('error:', error);
  //       //   } else {
  //       //     res.status(201).send({
  //       //       transcription: transcription,
  //       //       analysis: JSON.stringify(response)
  //       //     });
  //       //   }
  //       // });
  //     })
  //     .catch(err => {
  //       console.error('ERROR:', err);
  //     });
});

module.exports = router;
