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
const _ = require('lodash');

const Content = require("../models/content");
const Image = require("../models/image");
const globalConfig = require('../configs/global.js');
const serverConfig = require('../configs/server.js');
const imageUploadErrors = require("../constants/errorCodes").imageUpload;

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
    if(!_.includes(globalConfig.imageUpload.allowedFileTypes, ext)) {
      var err = new Error('Only images are allowed');
      err.code = 'BAD_FILETYPE';
      return callback(err)
    }
    callback(null, true);
  },
  limits:{
    fileSize: globalConfig.imageUpload.maxFileSizeInBytes
  }
}).single('mainImage');

router.post('/image', function (req, res) {
  var errors = {
    "mainImage": [],
    "token": []
  };

  upload(req, res, function (err) {
    if (err) {
      if(err.code == 'LIMIT_FILE_SIZE') {
        errors.mainImage.push(imageUploadErrors.LIMIT_FILE_SIZE);
      }
      if(err.code == 'BAD_FILETYPE') {
        errors.mainImage.push(imageUploadErrors.BAD_FILETYPE);
      }
    }
    if(!req.file) {
      errors.mainImage.push(imageUploadErrors.EMPTY_FILE);
    }

    jwt.verify(req.body.token, serverConfig.tokenKey, function(err, decoded) {
      if (err) {
        errors.token.push("Token cannot be decoded.");
      }
      else if (!errors.mainImage.length && !errors.token.length) {
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

        new Promise((resolve, reject) => {
          if(extension =='.gif') {
            fs.rename(req.file.path, outputDirecory + dateString + '/' + req.file.filename, function (err) {
              if (err) throw err;

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

              resolve(createdImage);
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

              resolve(createdImage);

              fs.unlinkSync(req.file.path);
            });
          }
        }).then(function(createdImage) {
          createdImage.save(function(err, image) {
            var createdContent = new Content({
              image: image._id,
              user: decoded.id,
              isReference: req.body.isReference,
              date: moment().format(),
            });

            createdContent.save(function(err, content) {
              res.send({success: true, content_id: content._id});
            });
          });

        }, function(reason) {
          res.send({success: false})
        });
      }
      else {
        res.send({
          success: false,
          errors: errors,
        })
      }
    })
  })
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
