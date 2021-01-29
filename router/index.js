var express = require('express');
var template = require('../lib/template.js');
var db = require('../lib/db.js');
var router = express.Router();

router.get('/', function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics, fields) {
      if (error) {
          next(error);
      }
      var list = template.list(topics, '/');
      title = 'JSChang';
      var description = 'Welcome to JSChang homepage';
      var html = template.HTML(title, list, `
          <h3>${title}</h3>
          <img src="/images/code.jpg" style="width:500px">
          <ul>
              ${description}
          </ul>
          `, `
          <a href="/topic/create">Create</a>
          `);
      response.end(html);
    });
  });

  module.exports = router;