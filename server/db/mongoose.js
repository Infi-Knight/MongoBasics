var mongoose = require('mongoose');

// We will use the builtin Promise library
mongoose.Promise = global.Promise;
// `open()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead,
// or set the `useMongoClient` option if using `connect()` or `createConnection()`.
// See http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect('process.env.MONGODB_URI || mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});
