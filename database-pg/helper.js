const bcrypt = require('bcrypt');
const { User, Message } = require('./index');

const getAllMessages = userId => {
  return new Promise((resolve, reject) => {
    Message.findAll({
      where: {
        userId: userId
      },
      order: [['createdAt', 'DESC']]
    })
      .then(messages => {
        resolve(messages);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getMessageInfo = (userId, recordingId) => {
  return new Promise((resolve, reject) => {
    Message.findOne({
      where: {
        userId: userId,
        recordingId: recordingId
      }
    })
      .then(message => {
        resolve(message);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const insertMessageInfo = (
  recordingId,
  userId,
  recordingTitle,
  recordingStartTime,
  recordingStopTime,
  fileSize
) => {
  return new Promise((resolve, reject) => {
    Message.create({
      recordingId: recordingId,
      recordingTitle: recordingTitle,
      recordingStartTime: recordingStartTime,
      recordingStopTime: recordingStopTime,
      fileSize: fileSize,
      userId: userId
    })
      .then(message => {
        resolve(message);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const updateMessage = (recordingId, message, sentiment) => {
  return new Promise((resolve, reject) => {
    Message.update(
      {
        message: message,
        sentiment: sentiment
      },
      { where: { recordingId: recordingId } }
    )
      .then(message => {
        resolve(message);
      })
      .catch(err => {
        reject(err);
      });
  });
};

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

const findOrCreateUserByFacebookId = (id, username) => {
  return new Promise((resolve, reject) => {
    User.findOrCreate({
      where: {
        facebookID: id
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
  findOrCreateUserByFacebookId,
  createUser,
  insertMessageInfo,
  getMessageInfo,
  updateMessage,
  getAllMessages,
  comparePassword
};
