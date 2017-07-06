const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// flush the database before running test cases:
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
        Todo.find().then((todos) => {
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

      // there should be no todo in the database
      Todo.find({}).then((todos) => {
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });
  });
});
