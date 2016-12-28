module.exports = (app, router, db) => {

  const Serializer = require('../serializers/users');

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
    res.send('users');
  });

  router.patch('/', (req, res) => {
    res.send('users');
  });

  router.delete('/', (req, res) => {
    res.send('users');
  });

  app.use('/api/users', router);
}
