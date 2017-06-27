// // ES6 provides us a feature called object destructuring:
// var user = {name: 'Rahul', age: 20};
// // then we can access the name property as a variable using:
// var {name} = user;
// console.log(name);
// // We can even access multiple properties by comma separating the props:

// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// // We can create new object id on fly:
// var objID = new ObjectID();
// console.log(objID);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    // stop if an error occurs
    return console.log('Unable to connect the mongodb server');
  }
  console.log('Connected to mongodb server');

  //create a Todos collection
  db.collection('Todos').insertOne({
    text: 'Kill the task',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert the todo', err);
    }

  // result.ops is an array of all the documents that were inserted
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  Create a Users collection
  db.collection('Users').insertOne({
    name: 'Ravi',
    age: 20,
    location: 'Baraut'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert the todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // explore the Object id
  db.collection('Users').insertOne({
    name: 'Yash',
    age: 20,
    location: 'Lucknow'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert the todo', err);
    }

    // print the Object id
    console.log(result.ops[0]._id);
    // timestamp is available only when you are using the object id
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});
