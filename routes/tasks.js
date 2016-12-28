module.exports = (app, router, db) => {

  const Serializer = require('../serializers/tasks');
  const ObjectId = require('mongodb').ObjectId;

  router.get('/', (req, res) => {
    const tasks = db.getDb().collection('tasks');
    tasks.find().toArray((err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error getting tasks'
        });
      }
      var data = [];
      result.forEach(function(task) {
        var taskData = Serializer.serialize(task, 'task');
        data.push(taskData);
      });
      return res.status(200).send({
        data: data
      });
    });
  });

  router.post('/', (req, res) => {
    const tasks = db.getDb().collection('tasks');
    tasks.insertOne({
      title: req.body.data.attributes.title,
      description: req.body.data.attributes.description,
      user_ids: []
    }, (err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error getting tasks'
        });
      }
      var taskData = Serializer.serialize(result.ops[0], 'task');
      return res.status(201).send({
        data: taskData
      });
    });
  });

  router.patch('/:id', (req, res) => {
    const task_id = new ObjectId(req.params.id);
    const tasks = db.getDb().collection('tasks');
    var user_ids = [];
    req.body.data.relationships.users.data.forEach(function(user) {
      var user_id = new ObjectId(user.id);
      user_ids.push(user_id);
    });

    tasks.update(
      { _id: task_id },
      {
        "title": req.body.data.attributes.title,
        "description": req.body.data.attributes.description,
        "user_ids": user_ids
      },  function(err, result) {
      if(err) {
        console.log(err);
        return res.status(404).send({
          message: 'Error adding user into task'
        });
      }
      return res.status(204).send();
    });
  });

  router.delete('/', (req, res) => {
    res.send('tasks');
  });

  app.use('/api/tasks', router);
}