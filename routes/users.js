module.exports = (app, router, db) => {

  const Serializer = require('../serializers/users');
  const generatePassword = require('password-generator');
  const ObjectId = require('mongodb').ObjectId;
  const AuthService = require('.././services/auth');

  router.get('/', (req, res) => {
    const users = db.getDb().collection('users');
    AuthService.verifyToken(req.token, decoded => {
      if(!decoded) {
        return res.status(401).send({
          message: 'Token expired or no token at all'
        });
      }
      AuthService.getCurrentUser(decoded, user => {
        if(!user) {
          return res.status(401).send({
            message: 'Invalid user generated from token'
          });
        }
        users.find({company_id: user.company_id}).toArray((err, result) => {
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

  router.get('/:id', function(req, res) {
    const users = db.getDb().collection('users');
    const id = new ObjectId(req.params.id);
    users.findOne({_id: id}, function(err, result) {
      if(err) {
        res.status(404).send({
          message: 'Error trying to get user'
        });
      }
      var userData = Serializer.serialize(result, 'user');
      return res.status(200).send({
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
