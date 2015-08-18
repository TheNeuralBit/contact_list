// Grab the model
var Contact = require('./models/contact');
module.exports = function(app) {
  // SERVER ROUTES
  
  // -- API --
  app.get('/api/contacts', function(req, res) {
      Contact.find(function(err, contacts) {
        // Handle errors
        if (err)
          res.send(err);

        // If no errors return contacts in JSON format
        res.json(contacts);
      });
  });

  // -- FRONTEND -- 
  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html');
  });
};
