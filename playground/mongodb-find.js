const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    // stop if an error occurs
    return console.log('Unable to connect the mongodb server');
  }
  console.log('Connected to mongodb server');

  // find method returned by mongo is a cursor or pointer
  // to the documents we wanna access
  // this pointer has some builtin methods

  // toArray method returned by find returns a js promise
  // hence if the promise was resolved then the callback with
  // docs will execute otherwise the callback with err will execute.
  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos:')
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to find the document', err);
  });


  // find todos which have been banged
  // for this task you need to pass the key value pair to find()
  db.collection('Todos').find({completed: true}).toArray().then((docs) => {
    console.log('completed:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to find the document', err);
  });

  // if we try something like this:
  // find(_id: "5954855fd569d22b93374060")
  // it's not gonna work because the id stored inside mongo is not a string
  // . It is an ObjectID. So we need to create an ObjectID:

  db.collection('Todos').find({
    _id: new ObjectID("595481e4d569d22b93373ff1")
  }).toArray().then((docs) => {
    console.log('Some todo:')
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to find that document', err);
  });

  // find the count of our documents
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('An error occured', err);
  });

  // db.close();
});
