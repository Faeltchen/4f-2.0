var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var autoIncrement = require('mongoose-auto-increment');
var Content = require("../models/content");
var router = express.Router();

router.post('/', function (req, res) {
  Content.find({}, function (err, result) {
    res.send(result);
  })
});

module.exports = router;
