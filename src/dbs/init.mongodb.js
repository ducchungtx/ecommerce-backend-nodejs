'use strict';

const mongoose = require('mongoose');

// pass luu trong sticky note
const connectString = `mongodb+srv://shop-dev:123@cluster0.8rown.mongodb.net/shop-dev?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = 'mongodb') {
    // dev
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        // maxPoolSize -> cải thiện hiệu suất kết nối, nếu vượt qua 50 sẽ cho ng đó xếp hàng
        maxPoolSize: 50,
        // useCreateIndex: true,
        // useFindAndModify: false,
      })
      .then((_) => console.log(`Connected Mongodb Success`))
      .catch((err) => console.log(`Error connection ${err}`));
  }

  static getInstance() {
    // Chi khoi tao mot ket noi
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
