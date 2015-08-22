var mongoose = require('mongoose');
var ContactSchema = new mongoose.Schema({
  name:          {type: String, default: ''},
  phones:        [{type: {type: String}, phone: String}],
  email:         [{type: {type: String}, email: String}],
  status:        {type: String, default: ''},
  out_of_office: {type: Boolean, default: false}
});

module.exports = mongoose.model('Contact', ContactSchema);
