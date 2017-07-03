const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect the mongodb server');
  }
  console.log('Connected to mongodb server');


  db.collection('Todos').findOneAndUpdate({
    "_id" : new ObjectID("595481e4d569d22b93373ff1")
  }, {
    $set: {
      text: 'Learn react'
    }
  }, {
    // We need the updated not the original one
    returnOriginal: false
  }).then((result) => {
    console.log('Updated doc:');
    console.log(result);
  }, (err) => {
    console.log('Unable to update that document', err);
  });

//  for update operators like $set refer
// https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc
  db.collection('Users').findOneAndUpdate({
    "_id" : new ObjectID("5959d854100b5c12397d1be9")
  }, {
    $set: {
      name: 'Rahul'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log('Updated doc:');
    console.log(result);
  }, (err) => {
    console.log('Unable to update that document', err);
  });

  // db.close();
});
