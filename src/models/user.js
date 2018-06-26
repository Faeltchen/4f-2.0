// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    email: String,
    role: String,
    registrationDate: Date,
    banExpiration: Date,
}).plugin(autoIncrement.plugin, 'User'));
