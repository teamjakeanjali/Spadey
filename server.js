const http = require('http');
const express = require('express');
const app = express();
const isDevMode = process.env.NODE_ENV === 'development';
const request = require('request');
const voiceAnalysis = require('./helpers/voiceAnalysis.js');
const socket = require('socket.io');
const ss = require('socket.io-stream');
const fs = require('fs');
const download = require('download');

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

// app.use('/message', voiceRoutes);

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});

const io = socket(server);

io.of('/audio').on('connection', function(socket) {
  ss(socket).on('send-audio', async (stream, data) => {
    const fileName = 'assets/audio.webm';
    await stream.pipe(fs.createWriteStream(fileName));
  });
});

const uploadWebmFile = () => {
  const dataString = {
    apikey: '53083a86c10baf8ceee6e2054873c806',
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
    if (!error && response.statusCode == 200) {
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
    if (!error && response.statusCode == 200) {
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
      console.log(response.body.data.output.url);
    }
  }

  request(options, callback);
};

const downloadFile = url => {
  download(url).then(data => {
    fs.writeFileSync('audio.flac', data);
  });
};

const analyzeSpeech = () => {
  const client = new speech.SpeechClient();
  // configuration needed for sync speech recognize
  const encoding = 'FLAC';
  const sampleRateHertz = 48000;
  const filename = 'audio.flac';
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

// downloadFile(
//   'https://margo.convertio.me/p/ZiHMbG7K4ZWtWJzN8vSTPg/53083a86c10baf8ceee6e2054873c806/audio_3.flac'
// );
// uploadWebmFile();
// directUpload();
// getFlacFile();
analyzeSpeech();
