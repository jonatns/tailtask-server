module.exports = (app, router, db) => {

  const Serializer = require('../serializers/companies');

  router.get('/', (req, res) => {
    const companies = db.getDb().collection('companies');
    companies.find().toArray((err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error getting companies'
        });
      }
      var data = [];
      result.forEach(function(company) {
        var companyData = Serializer.serialize(company, 'company');
        data.push(companyData);
      });
      return res.status(200).send({
        data: data
      });
    });
  });

  router.post('/', (req, res) => {
    const companies = db.getDb().collection('companies');
    companies.insertOne({
      name: req.body.data.attributes.name,
    }, (err, result) => {
      if(err) {
        res.status(404).send({
          message: 'Error adding company'
        });
      }
      var companyData = Serializer.serialize(result.ops[0], 'company');
      return res.status(201).send({
        data: companyData
      });
    });
  });

  router.patch('/', (req, res) => {
    res.send('companies');
  });

  router.delete('/', (req, res) => {
    res.send('companies');
  });

  app.use('/api/companies', router);
};
