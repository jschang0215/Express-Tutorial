var express = require('express');
var template = require('../lib/template.js');
var db = require('../lib/db.js');
var router = express.Router();
var cookie = require('cookie');

function authIsOwner(request, response) {
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie);
    }

    if(cookies.id === 'jschang0215' && cookies.pwd === '0215') {
        isOwner = true;
    }
    return isOwner;
}

function authStatusUI(request, response) {
    var isOwner = authIsOwner(request, response);
    var authStatusUI = `<a href="/login/login_page">Login</a><br>`;
    if(isOwner) {
        authStatusUI = `<a href="/login/logout_process">Logout</a><br>`
    }
    return authStatusUI;
}

router.get('/', function (request, response) {
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
          `, authStatusUI(request, response));

        var cookies = {};
        if(request.headers.cookie !== undefined) {
            cookies = cookie.parse(request.headers.cookie);
        }
        response.end(html);
    });
});

module.exports = router;