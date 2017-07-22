const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// Filter out the content we send to user.
// We are not going to send them back the password and auth token
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// method to generate and send the new user data
// this method will be overridden by the above method to filter the content
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

// UserSchema.statics creates a model method rather than an instance method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // // jwt throws an error if the authtoken was not valid
    // // so if we reach this point we know that something is not wrong
    // // hence we will send a promise with a reject clause which will
    // // cause the catch call in server js to run instead of the promise being resolved
    // return new Promise ((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  // return a promise
  return User.findOne ({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.methods.removeToken = function(token) {
  // pull lets you remove item from an array which match a certain criterai
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};

// Find a user tryin to login using his login credentials
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  // first verify email then check for password, remember we don't have a plain text password in the database
  return User.findOne({email}).then((user) => {
    if (!user) {
      // This will trigger the catch call in server.js
      return Promise.reject();
    }

    // bcrypt library does not support promised so we will wrap the callback in a promise
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// Mongoose middleware to run before the 'save' event
UserSchema.pre('save', function(next) {
  var user = this;

  // Prevent multiple hashings of same password:
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
