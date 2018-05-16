const http = require('http');
const express = require('express');
const app = express();
const isDevMode = process.env.NODE_ENV === 'development';
const voiceAnalysis = require('./helpers/voiceAnalysis.js');
const socket = require('socket.io');
const ss = require('socket.io-stream');
const fs = require('fs');

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
    await voiceAnalysis.uploadWebmFile();
  });
});

// downloadFile(
//   'https://margo.convertio.me/p/ZiHMbG7K4ZWtWJzN8vSTPg/53083a86c10baf8ceee6e2054873c806/audio_3.flac'
// );
// uploadWebmFile();
// directUpload();
// getFlacFile('54e3c22cfd7d400c95467e0b00b338c9');
// analyzeSpeech();
