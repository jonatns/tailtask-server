const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  db = require('./model/db');

app.use(morgan('dev'));
app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();
});
app.use(cors());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true}));

require('./routes')(app, express, db);

db.connectToDb(err => {
  if(err) {
    console.log(err);
  } else {
    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log(app.settings.env + ' server running on port ' + listener.address().port);
    });
  }
});
