module.exports = function(app, router, db) {

  const jwt = require('jsonwebtoken');
  const Serializer = require('../serializers/users');

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

  app.use('/api/auth', router);
};
