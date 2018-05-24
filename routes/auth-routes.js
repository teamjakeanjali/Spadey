const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../database-pg/helper');

// auth login
// router.get('/login', passport.authenticate('local'), (req, res) => {
//   console.log('login redirect getting fire???');
//   res.redirect('/');
// });

router.post('/login', passport.authenticate('local-login'), (req, res) => {
  res.redirect('/record');
});

// auth register
router.post('/register', (req, res) => {
  createUser(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) {
          res.status(500);
          res.send('Server Error');
        }
        res.send('Success');
      });
    })
    .catch(err => {
      res.status(500);
      res.send(err);
    });
});

// auth logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

// auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/#/record');
});

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', {
//     scope: ['email']
//   })
// );

// router.get(
//   '/facebook/redirect',
//   passport.authenticate('facebook'),
//   (req, res) => {
//     res.redirect('/#/record');
//   }
// );

module.exports = router;
