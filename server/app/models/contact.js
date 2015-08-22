var mongoose = require('mongoose');
var ContactSchema = new mongoose.Schema({
  name:          {type: String, default: ''},
  phones:        [{type: {type: String}, phone: String, _id: false}],
  emails:        [{type: {type: String}, email: String, _id: false}],
  status:        {type: String, default: ''},
  out_of_office: {type: Boolean, default: false}
});

module.exports = mongoose.model('Contact', ContactSchema);
