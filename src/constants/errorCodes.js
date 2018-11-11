const _ = require('lodash');
const globalConfig = require('../configs/global.js');
const bytesToSize = require('../helpers/files').bytesToSize;

module.exports = {
  register: {
    USERNAME_FORMAT: 'Special characters except \'_\' and \'-\' are not allowed in username.',
    USERNAME_LENGTH: 'Username has not a sufficient length.',
    USERNAME_EXISTS: 'Username already exists.',
    EMAIL_FORMAT: 'Email format ist not valid.',
    EMAIL_EXISTS: 'Email already exists.',
    PASSWORD_LENGTH: 'Password has not a sufficient length.',
    PASSWORD_REPEAT: 'Your repeated password was incorrect.',
  },
  imageUpload: {
    LIMIT_FILE_SIZE: 'The maximum file size for each image is up to ' + bytesToSize(globalConfig.imageUpload.maxFileSizeInBytes, true),
    BAD_FILETYPE: 'Only ' + _.dropRight(globalConfig.imageUpload.allowedFileTypes).join(', ') + ' and ' + _.last(globalConfig.imageUpload.allowedFileTypes) + ' are allowed',
    EMPTY_FILE: 'Please select an image file',
  },
  content: {
    COMMENT_LENGTH: 'Your comment must be between ' + globalConfig.comment.minLength + ' and ' + globalConfig.comment.maxLength + ' characters long.'
  },
};
