const http = require('http');
const express = require('express');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const path = require('path');
const pg = require('pg');
const session = require('express-session');
const passport = require('passport');
const { getMessageInfo } = require('./database-pg/helper');
const { Message } = require('./database-pg/index');
const bodyParser = require('body-parser');
const app = express();
const isDevMode = process.env.NODE_ENV === 'development';
const voiceAnalysis = require('./helpers/voiceAnalysis.js');
const socket = require('socket.io');
const ss = require('socket.io-stream');
const fs = require('fs');

var globalUserId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.get('/session', (req, res) => {
  let user = req.session.passport.user;
  if (user) {
    globalUserId = req.session.passport.user.id;
  }
  res.send(user);
});

app.use('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // returns true if a user already logged in.
  }
  next();
});

// const isLoggedIn = (req, res, next) => {
//   if (!req.user) {
//     console.log('is this happneing?');
//     res.redirect('/');
//   } else {
//     next();
//   }
// };

// app.get('/', isLoggedIn, (req, res) => {
//   console.log('=======');
//   // res.render('/src/index.html');
// });

//set up routes
app.use('/auth', authRoutes);

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

app.use('/', express.static(path.join(__dirname, '/src/index.html')));

app.post('/messageinfo', async (req, res) => {
  let userId = req.body.userId;
  let recordingId = req.body.recordingId;

  let message = await getMessageInfo(userId, recordingId);

  res.send({
    sentiment: JSON.parse(message.dataValues.sentiment),
    transcription: message.dataValues.message
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/index.html'));
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
    let recordingId = data.recordingId;
    const fileName = 'assets/audio.webm';
    await stream.pipe(fs.createWriteStream(fileName));
    await voiceAnalysis.uploadWebmFile(globalUserId, recordingId);
  });
});
