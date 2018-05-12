const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const bodyParser = require('body-parser');
const multer = require('multer');
const FileReader = require('filereader');
let reader = new FileReader();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// sets up tone analyzer credentials
let toneAnalyzer = new ToneAnalyzerV3({
  username: '1813adc9-1239-402c-9adb-7c5bfdb95664',
  password: 'pOt86kbRyD6A',
  version: '2017-09-21'
});
let upload = multer({ dest: './assets/' });
let type = upload.single('recording');

router.post('/audio', type, function(req, res) {
  console.log(req.body);

  fs.readFile(req.file.path, 'binary', data => {
    console.log(data);
  });
  // data url!
  // let audioData;
  // reader.readAsDataURL(req.file.path);
  // reader.onloadend = () => {
  //   audioData = reader.result.replace(/^data:audio\/flac;base64,/, '');
  // };

  // req.on('data', function(chunk) {
  //   src += chunk;
  // });
  // req.on('end', function() {
  //   console.log('end results', src);
  // });
  //readable stream
  // console.log('SOURCE', src);
  // stream = streamifier.createReadStream(src);
  // let destination = fs.createWriteStream('./assets/clientAudio.flac');
  // stream.pipe(transcode).pipe(destination);
  // transcode.on('error', err => console.log('err', err));
  // Creates a client
  // const client = new speech.SpeechClient();
  // // configuration needed for sync speech recognize
  // // const filename = './assets/clientAudio.flac';
  // const encoding = 'FLAC';
  // const sampleRateHertz = 44100;
  // const languageCode = 'en-US';
  // const config = {
  //   encoding: encoding,
  //   sampleRateHertz: sampleRateHertz,
  //   languageCode: languageCode,
  //   enableAutomaticPunctuation: true
  // };
  // const audio = {
  //   content: audioData
  // };
  // const request = {
  //   config: config,
  //   audio: audio
  // };
  // // Detects speech in the audio file
  // client.recognize(request).then(data => {
  //   const response = data[0];
  //   const transcription = response.results
  //     .map(result => result.alternatives[0].transcript)
  //     .join('\n');
  //   console.log(transcription);
  // });
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
