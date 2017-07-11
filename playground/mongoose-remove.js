const {objectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// // Todo.remove will remove everything from the todo collection
// Todo.remove({}).then((res) => {
//   console.log(res);
// });

// Todo.findOneAndRemove

// Todo.findByIdAndRemove
// If the deletion was successful you get the data back which was deleted
Todo.findByIdAndRemove('59635cb77a89c2034523a722').then((doc) => {
  console.log(doc);
});