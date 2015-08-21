var mongoose = require('mongoose');
var ContactSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  phones: [{type: String, number: String}],
  email: [{type: String, email: String}],
  out_of_office: {type: Boolean, default: false},
  status: {type: String, default: ''}
});

module.exports = mongoose.model('Contact', ContactSchema);
