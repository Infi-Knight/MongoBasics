const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
var {User} = require('./../models/user');
const {dummy, populateTodos, users, populateUsers} = require('./seed/seed');

// flush the database before running test cases and seed it with test data
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('# POST /todos', () => {
  it('should create a new Todo', (done) => {
    var text = 'Sample text';

    // supertest will automatically convert our text object to JSON
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        // expect provided by expect assertions library
        // chek if we got a valid response
        expect(res.body.text).toBe(text)
      })    // Now check for the database
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // if we get a valid response check if the database was
        // successfully updated
        Todo.find({text}).then((todos) => {
          // one todo should have been added to database
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });


  it('should not create a todo with invalid body data', (done) => {

    // we will test this request by sending an empty object
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        // If we didn't get any http response
        return done(err);
      }

      // there should be no todos in the database
      // because beforeEach() flushes database before running
      // a test case
      Todo.find({}).then((todos) => {
        // No of todos = zero
        expect(todos.length).toBe(3);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('# GET /todos', () => {
  it('should read all the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});

describe('# GET /todos/:id', () => {
  it ('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${dummy[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(dummy[0].text);
      })
      .end(done);
  });

  it ('should return 404 if no todo is found', (done) => {
    var non_existing = new ObjectID();
    request(app)
      .get(`/todos/${non_existing.toHexString()}`)
      // .get(`/todos/${dummy[0]._id.toHexString()}`)  // this line will cause the test to fail
      .expect(404)
      .end(done);
  });

  it ('should return 404 for invalid id', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('# DELETE /todos/:id', () => {
  it ('should remove a todo', (done) => {
    var hexId = dummy[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // Check the database
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it ('should return 404 if todo was not found', (done) => {
    var non_existing = new ObjectID();
    request(app)
      .delete(`/todos/${non_existing}`)
      // .get(`/todos/${dummy[0]._id.toHexString()}`)  // this line will cause the test to fail
      .expect(404)
      .end(done);
  });

  it ('should return 404 if a invalid ObjectID is requested', (done) => {
    request(app)
      .delete('/todos/123')
      // .get(`/todos/${dummy[0]._id.toHexString()}`)  // this line will cause the test to fail
      .expect(404)
      .end(done);
  });
});

describe('# PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = dummy[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it ('should clear completedAt when todo is not completed', (done) => {
    var hexId = dummy[1]._id.toHexString();
    var text = 'Update from the test suite';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

  it ('should return 404 if todo was not found', (done) => {
    var non_existing = new ObjectID();
    request(app)
      .patch(`/todos/${non_existing}`)
      .send({
        text: 'Pakistan sucks',
        completed: 'true'
      })
      .expect(404)
      .end(done);
  });

  it ('should return 404 if a invalid ObjectID is requested', (done) => {
    request(app)
      .patch('/todos/123')
      .send({
        text: 'Express rocks',
        completed: 'false'
      })
      .expect(404)
      .end(done);
  });
});

describe('# GET /users/me', () => {
  it ('should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)  // Setting headers in supertest
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it ('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });
})

describe('# POST /users/', () => {
  it ('should create a user when valid data is passed', (done) => {
    var email = 'Pakistan@sucks.com';
    var password = 'boisplayedwell';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();  // We can't use dot notation here because of the hyphen
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          // plain text password should not be equal to the hashed password
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it ('should return validation error if invalid data passed', (done) => {
    var badEmail = 'despacito.com';
    request(app)
      .post('/users')
      .send({badEmail})
      .expect(400)
      .end(done);
  });

  it ('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'password'
      })
      .expect(400)
      .end(done);
  });
});