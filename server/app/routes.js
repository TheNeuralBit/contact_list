// Grab the model
var Contact = require('./models/contact');
module.exports = function(app) {
  // SERVER ROUTES
  
  // -- API --
  app.route('/api/contacts')
    .get(function(req, res) {
      Contact.find(function(err, contacts) {
        // Handle errors
        if (err) {
          res.send(err);
        }

        // If no errors return contacts in JSON format
        res.json(contacts);
      });
    })
    .post(function(req, res) {
      Contact.create(req.body, function(err, post){
        if (err)
          res.send(err);
        res.json(post);
      });
    });

  app.route('/api/contacts/:contact_id')
    .get(function(req, res) {
      Contact.findById(req.params.contact_id, function(err, contact) {
        if (err)
          res.send(err);
        res.json(contact);
      });
    })
    .put(function(req, res) {
      console.log(req.body);
      Contact.findById(req.params.contact_id, function(err, contact) {
        if (err)
          res.send(err);

        for (var key in req.body) {
          contact[key] = req.body[key];
        }
        contact.save();
        res.json(contact);
      });
    })
    .delete(function(req, res) {
      Contact.findByIdAndRemove(req.params.contact_id,
        function(err, post) {
          if (err)
            res.send(err);
          res.json(post);
        });
    });

  // -- FRONTEND -- 
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
};
