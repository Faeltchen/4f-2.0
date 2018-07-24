var express = require('express');
var mongoose = require('mongoose');
var User = require("../models/user");
var validator = require('email-validator');
var passwordHash = require('password-hash');
var moment = require('moment-timezone');
var jwt = require('jsonwebtoken');
var autoIncrement = require('mongoose-auto-increment');
const secretToken = "ilovescotchyscotch";

var router = express.Router();

router.post('/authenticate', function (req, res) {
  try {
    var decoded = jwt.verify(req.body.token, secretToken);
    res.send({
      success: true,
      user: decoded,
    });
    console.log(decoded);
  } catch(err) {
    res.send({
      success: false,
    });
  }
});

router.post('/login', function (req, res) {
  var token;
  var errors = {
    "username": [],
    "password": [],
  };

  // find the user
  User.findOne({
    name: req.body.username
  }, function(err, user) {
    if (!user) {
      errors.username.push('Authentication failed. User not found.');
      errors.password.push(' ');
    } else if (user) {

      if (passwordHash.verify(req.body.password, user.password)) {
        console.log(user);
        const payload = {
          id: user._id,
          name: user.name,
          role: user.role,
        };
        token = jwt.sign(payload, secretToken, {
          expiresIn: '2d' // expires in 24 hours
        });
      } else {
        errors.password.push('Authentication failed. Wrong password.');
      }
    }

    if(errors.username.length || errors.password.length)
      res.send({success: false, errors: errors});
    else
      res.send({success: true, token: token, user: jwt.verify(token, secretToken)});
  });
});

router.post('/create', function (req, res) {
  var errors = {
    "username": [],
    "password": [],
    "email": [],
  };

  var reqUsername = req.body.username.trim().replace(/[^a-zA-ZöÖüÜäÄ0-9_-]/g,'');
  var reqPassword = req.body.password;
  var reqEmail = req.body.email;

  if(reqUsername.length !== req.body.username.trim().length) {
    errors.username.push("Special characters except '_' and '-' are not allowed in username.");
  }
  else if (reqUsername.length > 20 || reqUsername.length < 5) {
    errors.username.push("Username has not a sufficient length.");
  }
  if(reqPassword.length > 20  || reqPassword.length < 8) {
    errors.password.push("Password has not a sufficient length.");
  }
  if(!validator.validate(reqEmail)) {
    errors.email.push("Email format ist not valid.");
  }

  if(!errors.username.length && !errors.password.length && !errors.email.length) {
    Promise.all([
      User.find({name : reqUsername}, function (err, result) {
        if(result.length) {
          errors.username.push("Username already exists.");
        }
      }),
      User.find({email : reqEmail}, function (err, result) {
        if(result.length) {
          errors.email.push("Email already exists.");
        }
      })
    ]).then(() => {
      if(errors.username.length || errors.password.length ||errors.email.length) {
        res.send(errors);
      }
      else {
        var createdUser = new User({
          name: req.body.username,
          password: passwordHash.generate(reqPassword),
          email: req.body.email,
          role: 'member',
          registrationDate: moment().format(),
        });

        createdUser.save(function(err) {
          if (err) throw err;

          console.log('User saved successfully');
          res.json({ success: true });
        });
      }
    });
  }
  else {
    res.send(errors);
  }
  //moment().tz("Europe/Berlin").format()
});

module.exports = router;

/*
require('connect-flash');
var ExpressBrute = require('express-brute'),
    MemcachedStore = require('express-brute-memcached'),
    moment = require('moment'),
    store;

if (config.environment == 'development'){
    store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
} else {
    // stores state with memcached
    store = new MemcachedStore(['127.0.0.1'], {
        prefix: 'NoConflicts'
    });
}

var failCallback = function (req, res, next, nextValidRequestDate) {
    req.flash('error', "You've made too many failed attempts in a short period of time, please try again "+moment(nextValidRequestDate).fromNow());
    res.redirect('/login'); // brute force protection triggered, send them back to the login page
};
var handleStoreError = handleStoreError: function (error) {
    log.error(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
}
// Start slowing requests after 5 failed attempts to do something for the same user
var userBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 5*60*1000, // 5 minutes
    maxWait: 60*60*1000, // 1 hour,
    failCallback: failCallback,
    handleStoreError: handleStoreError
}
});
// No more than 1000 login attempts per day per IP
var globalBruteforce = new ExpressBrute(store, {
    freeRetries: 1000,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    lifetime: 24*60*60, // 1 day (seconds not milliseconds)
    failCallback: failCallback,
    handleStoreError: handleStoreError
});

app.set('trust proxy', 1); // Don't set to "true", it's not secure. Make sure it matches your environment
app.post('/auth',
    globalBruteforce.prevent,
    userBruteforce.getMiddleware({
        key: function(req, res, next) {
            // prevent too many attempts for the same username
            next(req.body.username);
        }
    }),
    function (req, res, next) {
        if (User.isValidLogin(req.body.username, req.body.password)) { // omitted for the sake of conciseness
         	// reset the failure counter so next time they log in they get 5 tries again before the delays kick in
            req.brute.reset(function () {
                res.redirect('/'); // logged in, send them to the home page
            });
        } else {
            res.flash('error', "Invalid username or password")
            res.redirect('/login'); // bad username/password, send them back to the login page
        }
    }
);
*/
