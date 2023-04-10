'use strict';

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    info: process.env.DEV_DB_INFO,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },
  db: {
    info: process.env.PRO_DB_INFO,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
