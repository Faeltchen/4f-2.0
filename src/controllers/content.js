const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment-timezone');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Content = require("../models/content");
const Comment = require("../models/comment");

const router = express.Router();
const secretToken = "ilovescotchyscotch";

router.post('/', function (req, res) {
  Promise.all([
    Content.count({}),
    Content.find({}).sort({date: 'desc'}).populate('image')
  ]).then(([count, wallContent]) => {
    var response = {
      wallContent,
      meta: {
        limit: 10,
        total_count: count
      }
    }
    res.json(response);
  });
});

router.post('/comment/', function (req, res) {
  var errors = {
    "comment": [],
  };

  jwt.verify(req.body.token, secretToken, function(err, decoded) {
    if (err)
      errors.comment.push("Token cannot be decoded");

    if(!req.body.addComment.length)
      errors.comment.push("Your comment is not long enough");

    if(!req.body.content_id.length)
      errors.comment.push("Invalid content id");

    new Promise((resolve, reject) => {
      if(!errors.comment.length) {
        Content.count({_id: req.body.content_id}, function (err, count) {
          if(count) {
            var createdComment = new Comment({
              content: req.body.content_id,
              user: decoded.id,
              comment: req.body.addComment,
              replys: req.body.addCommentReplys,
              date: moment().format(),
            });
            createdComment.save(function(err, comment) {
              const comments = Comment.find({content: req.body.content_id}).populate('replys').populate({
                path: 'user',
                select: '_id name',
              })
              resolve(comments);
            });
          }
          else {
            errors.comment.push("No content found");
            reject(errors);
          }
        });
      } else {
        reject(errors);
      }
    }).then(function(value) {
      console.log(value);
      res.send({success: true, comments: value})
    }, function(reason) {
      res.send({success: false, errors: reason})
    });
  });
});

router.post('/:id', function (req, res) {
  Promise.all([
    Content.findOne({_id: req.params.id}).populate('image').populate({
      path: 'user',
      select: '_id name role',
    }),
    Comment.find({content: req.params.id}).populate('replys').populate({
      path: 'user',
      select: '_id name',
    }).deepPopulate('replys.user'),
  ]).then(([content, comments]) => {
    res.json({
      content: content,
      comments: comments,
    });
  });
});

module.exports = router;
