const Sequelize = require('sequelize');
require('dotenv').config();

// options for local database
const options = {
  dialect: 'postgres',
  dialectOptions: {
    dialectModulePath: 'pg',
    trustedConnection: true
  },
  host: process.env.DATABASE_URL || 'host',
  database: process.env.DATABASE || 'spadey',
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};

const dbPath = options;
const sequelize = new Sequelize(dbPath);

sequelize
  .authenticate()
  .then(() => {
    console.log('successfully connected to db');
  })
  .catch(err => {
    console.error(err);
  });

const User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  googleID: {
    type: Sequelize.STRING,
    unique: true
  }
});

const Message = sequelize.define('message', {
  message: {
    type: Sequelize.STRING
  },
  sentiment: {
    type: Sequelize.STRING
  },
  recordingId: {
    type: Sequelize.STRING
  }
});

Message.belongsTo(User);

sequelize.sync().then(() => {
  console.log('User table created');
});

module.exports = {
  Sequelize,
  sequelize,
  User,
  Message
};
