const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const dummy = [{text: 'Learn react'}, {text: 'GOT july 18'}, {text: 'Blah'}];

// flush the database before running test cases and sedd it with dummy
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(dummy);
  }).then(() => done());
});

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
