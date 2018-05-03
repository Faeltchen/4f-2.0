var express = require('express');
var mongoose = require('mongoose');
var User = require("./models/user");

var app = express();

mongoose.connect('mongodb://localhost/4f');

app.get('/api/createUser', function (req, res) {
  /*

  // create a sample user
  var nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
  */
  res.send('Hello World!');
});

app.post('/api/createUser', function (req, res) {
  res.send(req.body.username);
  /*

  // create a sample user
  var nick = new User({
    name: 'Nick Cerminara',
    password: 'password',
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
  */
  //res.send('Hello World!');
});


app.listen(443, function () {
  console.log('Example app listening on port 443!');
});
