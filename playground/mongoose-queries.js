const {objectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '595f320e1974d810c92cd897';
const user_id = '595f32d30cadf811ef0c547d';
// mongoose will automatically convert our string id to objectID
// Todos.find returns an array of documents
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
}, (err) => {
  console.log(err);
});

// Todo.fidnOne() will only the first occurrence of the document
// and return an object
Todo.findOne({
  _id: id
}).then((todo) => {
  if (!todo) {
    return console.log('Id not found')
  }
  console.log('Todo', todo);
}, (err) => {
  console.log(err);
});

Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('Id not found')
  }
  console.log('Todo', todo);
}, (err) => {
  console.log(err);
  // If the id is not a valid objectID catch the error
}).catch((err) => console.log(err));

User.findById(user_id).then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch( (err) => {
  return console.log('Invalid userid');
});
