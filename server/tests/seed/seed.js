const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
                {
                  _id: userOneId,
                  email: 'sourav@du.com',
                  password: '123dfgh',
                  tokens: [{
                    access: 'auth',
                    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
                  }]
                },
                {
                  _id: userTwoId,
                  email: 'rahul@miet.ac.in',
                  password: 'blahblah',
                  tokens: [{
                    access: 'auth',
                    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
                  }]
                }
              ]

const dummy = [
                {text: 'Learn react', _id: new ObjectID(), _creator: userOneId},
                {text: 'Blah', _id: new ObjectID(), completed: true, completedAt: 444, _creator: userTwoId}
              ];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummy);
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // User.save() returns a promise
    var userOne = new User(users[0]).save().then();
    var userTwo = new User(users[1]).save().then();

    // Check for the two promises to be resolved and then return the promise
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {dummy, populateTodos, populateUsers, users};
