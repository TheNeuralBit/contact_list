var mongoose = require('mongoose');
module.exports = mongoose.model('Contact', {
  name: {type: String, default: ''},
  phone: {
    unclass: String,
    secure: String,
    mobile: String,
    other: [{type: String, number: String}]
  },
  email: {
    unclass: String,
    secure:  String,
    other: [{type: String, email: String}]
  },
  out_of_office: {type: Boolean, default: false},
  status: {type: String, default: ''}
});
