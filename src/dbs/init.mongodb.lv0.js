'use strict';

const mongoose = require('mongoose');

const connectString = `mongodb+srv://shop-dev:123@cluster0.8rown.mongodb.net/shop-dev?retryWrites=true&w=majority`;
mongoose
  .connect(connectString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((_) => console.log(`Connected Mongodb Success`))
  .catch((err) => console.log(`Error connection ${err}`));

// dev
if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
