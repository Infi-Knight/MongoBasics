const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    // stop if an error occurs
    return console.log('Unable to connect the mongodb server');
  }
  console.log('Connected to mongodb server');

  // // deleteMany
  // db.collection('Todos').deleteMany({
  //   text: 'Go to gym'
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete that document', err);
  // });

  // // deleteOne
  // db.collection('Todos').deleteOne({
  //   text: 'Kill the task'
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete that document', err);
  // });

  // // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({
  //   completed: true
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete that document', err);
  // });

<<<<<<< HEAD
  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID("595290f6158541078dc83a71")
  // }).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log('Unable to delete that document', err);
  // })
=======
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("595290f6158541078dc83a71")
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Unable to delete that document', err);
  })
>>>>>>> 7f0e844f44106973e58b72de49fbf363604e95ee

  // db.close();
});
