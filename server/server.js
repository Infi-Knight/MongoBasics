const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
// setup the body-parser middleware which will attach body to req object
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    // The array we recieved isn't flexible
    // so we send an object
    res.send({todos})
  }, (err) => {
    res.status(400).send(err);
  });
});

app.post('/users', (req, res) => {
  var user = new User({
    email: req.body.email
  });

  user.save().then((doc) => {
    res.send(doc)
  }, (err) => {
    res.status.send(err);
  });
});

// Get an individual todo 
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  // If the id is not valid :
  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Not a valid id');
  }

  Todo.findById(id).then((todo) => {
    if(todo) {
      res.send({todo});
    } else {
      res.status(404).send('No todo for that id');
    }
  }).catch((e) => {
    res.status(400).send('Internal server error');
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send('No todo for that id');
    } 
    
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('Internal server error');
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, process.env.IP, () => {
  console.log(`Server up and running on port ${port}`);
});

// we will use this export for testing purposes
module.exports = {app};
