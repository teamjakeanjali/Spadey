const bcrypt = require('bcrypt');
const { User } = require('./index');

const hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err);
      } else if (!res) {
        reject('password does not match');
      } else {
        resolve();
      }
    });
  });
};

const findUserById = id => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(user => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const findOrCreateUserByGoogleId = (id, username) => {
  return new Promise((resolve, reject) => {
    User.findOrCreate({
      where: {
        googleID: id
      },
      defaults: {
        username: username
      }
    })
      .then(([user, created]) => {
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const createUser = userInfo => {
  return new Promise((resolve, reject) => {
    const { username, email, password } = userInfo;
    hashPassword(password)
      .then(hash => {
        User.create({
          username,
          email,
          password: hash
        })
          .then(user => {
            resolve(user);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  findUserById,
  findOrCreateUserByGoogleId,
  createUser
};
