const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { User, Sequelize } = require('../database-pg');
const {
  findUserById,
  findOrCreateUserByGoogleId
} = require('../database-pg/helper');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  let id = JSON.parse(user.googleID);
  if (id) {
    findUserById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  } else {
    done(null, user);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET
    },
    (accessToken, refreshToken, profile, done) => {
      findOrCreateUserByGoogleId(profile.id, profile.displayName)
        .then(user => {
          done(null, user);
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/redirect',
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      findOrCreateUserByFacebookId(profile.id, profile.name.givenName)
        .then(user => {
          done(null, user);
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

passport.use(
  'local-login',
  new LocalStrategy((usernameOrEmail, password, done) => {
    const Op = Sequelize.Op;
    User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      }
    })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  })
);
