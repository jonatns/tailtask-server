const jwt = require('jsonwebtoken');
const db = require('../model/db');

module.exports = {

  verifyToken: function(token, cb) {
    jwt.verify(token, 'secretkey', function(err, decoded) {
      if (err) {
        cb(decoded);
      } else {
        cb(decoded);
      }
    });
  },
  getCurrentUser: function(decoded, user) {
    const users = db.getDb().collection('users');
    users.findOne({ email: decoded.email }, function(err, result) {
      if(err) {
        user(null);
      }
      user(result);
    });
  }
};
