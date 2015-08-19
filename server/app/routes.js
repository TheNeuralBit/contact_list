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
      var contact = new Contact();
      contact.name = req.body.name;
      contact.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Contact \'' + contact.name + '\' created'});
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
      Contact.findById(req.params.contact_id, function(err, contact) {
        if (err)
          res.send(err);
        contact.name = req.body.name;
        contact.save(function(err) {
          if (err)
            res.send(err);
          res.json({ message: 'Contact updated' });
        });
      });
    })
    .delete(function(req, res) {
      Contact.remove(
        {_id: req.params.contact_id},
        function(err, contact) {
          if (err)
            res.send(err);
          res.json({ message: 'Successfully deleted' });
        });
    });

  // -- FRONTEND -- 
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
};
