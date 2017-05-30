module.exports = function(app, router, db) {

  const jwt = require('jsonwebtoken');
  const Serializer = require('../serializers/users');
  const AuthService = require('.././services/auth');

  router.post('/', function(req, res) {
    const users = db.getDb().collection('users');
    users.findOne({ email: req.body.email }, (err, result) => {
      if(err) {
        res.status(401).send({
          message: 'email or password incorrect'
        });
      } else if (result) {
        if(req.body.password === result.password) {
          const token = jwt.sign({id: result._id, email: result.email}, 'secretkey', {expiresIn: "2 days"});
          res.status(200).send({
            token: token
          });
        } else {
          res.status(401).send({
            message: 'email or password incorrect'
          });
        }
      } else {
        res.status(401).send({
          message: 'email or password incorrect'
        });
      }
    });
  });

  router.post('/refresh', function(req, res) {
    const users = db.getDb().collection('users');
    AuthService.verifyToken(req.body.token, decoded => {
      if(!decoded) {
        return res.status(401).send({
          message: 'Token expired or no token at all'
        });
      }
      users.findOne({ email: decoded.email }, (err, result) => {
        if(err) {
          res.status(401).send({
            message: 'no user found'
          });
        } else if (result) {
          const token = jwt.sign({id: result._id, email: result.email}, 'secretkey', {expiresIn: "2 days"});
          res.status(200).send({
            token: token
          });
        } else {
          res.status(401).send({
            message: 'no user found'
          });
        }
      });
    });
  });

  app.use('/api/auth', router);
};
