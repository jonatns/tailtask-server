module.exports = (app, router, db) => {

  const Serializer = require('../serializers/users');
  const generatePassword = require('password-generator');
  const ObjectId = require('mongodb').ObjectId;

  router.get('/', (req, res) => {
    const users = db.getDb().collection('users');
    users.find().toArray((err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error getting users'
        });
      }
      var data = [];
      result.forEach(function(user) {
        var userData = Serializer.serialize(user, 'user');
        data.push(userData);
      });
      return res.status(200).send({
        data: data
      });
    });
  });

  router.post('/', (req, res) => {
    const users = db.getDb().collection('users');
    const password = generatePassword(12);
    const company_id = new ObjectId(req.body.data.relationships.company.data.id);
    users.insertOne({
      firstname: req.body.data.attributes.firstname,
      lastname: req.body.data.attributes.lastname,
      email: req.body.data.attributes.email,
      company_id: company_id,
      password: password
    }, (err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error adding user'
        });
      }
      var userData = Serializer.serialize(result.ops[0], 'user');
      return res.status(201).send({
        data: userData
      });
    });
  });

  router.patch('/', (req, res) => {
    res.send('users');
  });

  router.delete('/', (req, res) => {
    res.send('users');
  });

  app.use('/api/users', router);
};
