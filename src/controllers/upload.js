const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');
const randomstring = require("randomstring");
const thumb = require('node-thumbnail').thumb;
const ThumbnailGenerator = require('video-thumbnail-generator').default
const sizeOf = require('image-size');

const Content = require("../models/content");
const Image = require("../models/image");

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

        var dt = new Date();
        var dateString = '/' + dt.getDate() + (dt.getMonth() + 1) + dt.getFullYear();

        if (!fs.existsSync(outputDirecory))
            fs.mkdirSync(outputDirecory);
        if (!fs.existsSync(outputDirecory + dateString))
            fs.mkdirSync(outputDirecory + dateString);
        if (!fs.existsSync(outputDirecory + dateString + '/thumb'))
            fs.mkdirSync(outputDirecory + dateString + '/thumb');

        var extension = path.extname(req.file.originalname);
        var dimensions = sizeOf(req.file.path);

        if(extension =='.gif') {
          fs.rename(req.file.path, outputDirecory + dateString + '/' + req.file.filename, function (err) {
            if (err) throw err;
            console.log('Move complete.');
            const tg = new ThumbnailGenerator({
              sourcePath: outputDirecory + dateString + '/' + req.file.filename,
              thumbnailPath: outputDirecory + dateString + '/thumb/',
            });

            tg.generate({
              size: '200x?',
              filename: req.file.filename.replace(/\.[^/.]+$/, "") + '.png',
              timestamps: ['0'],
            }).then(console.log);

            var createdImage = new Image({
              filename: req.file.filename.replace(/\.[^/.]+$/, "") + '.png',
              originalname: req.file.originalname,
              path: decoded.id + dateString,
              size: req.file.size
            });

            createdImage.save(function(err, image) {

              var createdContent = new Content({
                image: image._id,
                user: decoded.id,
                date: moment().format(),
              });

              createdContent.save(function(err, content) {
                //console.log(err);
              });
            });
          });
        }
        else {
          imagemin([req.file.path], (outputDirecory + dateString), {
            plugins: [
              imageminJpegtran(),
              imageminPngquant({quality: '65-80'})
            ]
          }).then(files => {
            thumb({
              suffix: '',
              source: outputDirecory + dateString + '/' + req.file.filename,
              destination: outputDirecory + dateString + '/thumb/',
              concurrency: 4,
              width: 200,
            }, function(files, err, stdout, stderr) {
              console.log('All done!');
            });

            var createdImage = new Image({
              filename: req.file.filename,
              originalname: req.file.originalname,
              path: decoded.id + dateString,
              width: dimensions.width,
              height: dimensions.height,
              size: req.file.size
            });

            createdImage.save(function(err, image) {
              var createdContent = new Content({
                user: decoded.id,
                image: image._id,
                date: moment().format(),
              });

              createdContent.save();
            });

            fs.unlinkSync(req.file.path);
          });
        }
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

function move(oldPath, newPath, callback) {

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
        if (err.code === 'EXDEV') {
            copy();
        } else {
            callback(err);
        }
        return;
    }
    callback();
  });

  function copy() {
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    readStream.on('error', callback);
    writeStream.on('error', callback);

    readStream.on('close', function () {
        fs.unlink(oldPath, callback);
    });

    readStream.pipe(writeStream);
  }
}

module.exports = router;
