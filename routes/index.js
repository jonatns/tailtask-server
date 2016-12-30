const fs = require('fs');

module.exports = (app, express, db) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf('.'));
    var router = express.Router();
    require('./' + name)(app, router, db);
  });
};
