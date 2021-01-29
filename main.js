var express = require('express');
var app = express();
var port = 3000;
var author = require('./lib/author.js');
var compression = require('compression');
var bodyParser = require('body-parser');
var template = require('./lib/template.js');
var db = require('./lib/db.js');
var helmet = require('helmet')

app.use(helmet());

var indexRouter = require('./router/index.js');
var topicRouter = require('./router/topic.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.get('*', function(req, res){
  res.status(404).send('Page not found');
});

app.get('*', function(err, req, res, next){
  res.status(500).send('Fatal Error');
});

app.listen(port, function() {
  console.log(`Example app listening at http://localhost:${port}`)
});