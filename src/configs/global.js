var Global = {
  imageUpload : {
    maxFileSizeInBytes: 1024 * 1024,
    allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
  },
  comment: {
    minLength: 1,
    maxLength: 2000,
  }
};
module.exports = Global;
