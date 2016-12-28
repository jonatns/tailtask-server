const MongoClient = require('mongodb').MongoClient,
  config = require('config'),
  dbConfig = config.get('db.dbConfig');

const url = 'mongodb://' + dbConfig.username + dbConfig.password + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName;

var _db;

module.exports = {

  connectToDb: function(callback) {
    MongoClient.connect(url, function(err, db) {
      _db = db;
      return callback(err);
    } );
  },

  getDb: function() {
    return _db;
  }
};
