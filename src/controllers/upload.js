var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment-timezone');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var multer  = require('multer');
var imagemin = require('imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminPngquant = require('imagemin-pngquant');
var path = require('path');
var randomstring = require("randomstring");

var Content = require("../models/content");
var Image = require("../models/image");

const secretToken = "ilovescotchyscotch";

var router = express.Router();

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, '../temp/')
    },
    filename: function (req, file, callback) {
      callback(null, randomstring.generate() + path.extname(file.originalname))
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true);
  },
  limits:{
    fileSize: 1024 * 1024
  }
});

router.post('/image', upload.single('mainImage'), function (req, res) {
  var errors = {
    "mainImage": [],
    "token": []
  };

  jwt.verify(req.body.token, secretToken, function(err, decoded) {
    if (err) {
      errors.token.push("Token cannot be decoded.");
    } else {
      if (req.file) {
        const outputDirecory = "../uploads/" + decoded.id;

        if (!fs.existsSync(outputDirecory)){
            fs.mkdirSync(outputDirecory);
        }

        imagemin([req.file.path], outputDirecory, {
          plugins: [
            imageminJpegtran(),
            imageminPngquant({quality: '65-80'})
          ]
        }).then(files => {
          var createdImage = new Image({
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: outputDirecory,
            size: req.file.size
          });

          createdImage.save(function(err, image) {
            var createdContent = new Content({
              type: "image",
              reference: image.id,
              date: moment().format(),
            });

            createdContent.save(function(err, content) {

            });
          });

          fs.unlinkSync(req.file.path);
        }).catch(error => {
          console.log(error);
        });
      }
      else {
        errors.mainImage.push("No file received");
      }
    }
  });

  if(errors.mainImage.length || errors.token.length) {
    res.send({
      success: false,
      errors: errors,
    })
  }
  else {
    res.send({
      success: true
    })
  }
});

module.exports = router;
