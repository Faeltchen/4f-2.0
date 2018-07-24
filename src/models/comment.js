// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
// CHANGE from 1.x: need to pass in mongoose instance
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Comment', new Schema({
    content: { type: Number, ref: 'Content' },
    user: { type: Number, ref: 'User' },
    comment: String,
    replys: [{ type: Number, ref: 'Comment' }],
    date: Date,
}).plugin(autoIncrement.plugin, 'Comment').plugin(deepPopulate, {
  populate: {
    'replys.user': {
      select: 'name',
    },
  }
}));
