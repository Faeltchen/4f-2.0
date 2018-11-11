const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment-timezone');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const striptags = require('striptags');
const sanitizeHtml = require('sanitize-html');
const Content = require("../models/content");
const Comment = require("../models/comment");
const globalConfig = require('../configs/global.js');
const contentErrors = require("../constants/errorCodes").content;

const router = express.Router();
const secretToken = "ilovescotchyscotch";

router.post('/', function (req, res) {
  Promise.all([
    Content.count({}),
    Content.find({isReference: {$in: [false]}}).sort({date: 'desc'}).populate('image')
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

    if(!req.body.content_id.length)
      errors.comment.push("Invalid content id");

    const commentLengthAccepted = (req.body.addComment.replace(/[\n\r\t\s]/g, "").length >= globalConfig.comment.minLength) &&
                                  (req.body.addComment.replace(/[\n\r\t\s]/g, "").length <= globalConfig.comment.maxLength);

    if (!commentLengthAccepted)
      errors.comment.push(contentErrors.COMMENT_LENGTH);

    new Promise((resolve, reject) => {
      if(!errors.comment.length) {
        Content.count({_id: req.body.content_id}, function (err, count) {
          if(count) {
            var createdComment = new Comment({
              content: req.body.content_id,
              user: decoded.id,
              comment: sanitizeHtml(req.body.addComment.replace(/\n\s*\n\s*\n/g, '\n\n'), { allowedTags: [ 'br' ] }),
              contentRef: req.body.contentRef,
              replys: req.body.addCommentReplys,
              date: moment().format(),
            });
            createdComment.save(function(err, comment) {
              resolve(
                Comment.find({content: req.body.content_id}).populate(
                  {
                    path: 'user',
                    select: '_id name',
                  },
                ).deepPopulate(['replys.user', 'contentRef.image'])
              );
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
      res.send({success: true, comments: value})
    }, function(reason) {
      console.log(reason);
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
    Comment.find({content: req.params.id}).populate(
      {
        path: 'user',
        select: '_id name',
      },
    ).deepPopulate(['replys.user', 'contentRef.image'])

  ]).then(([content, comments]) => {
    res.json({
      content: content,
      comments: comments,
    });
  });
});

module.exports = router;
