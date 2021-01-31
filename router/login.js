var express = require('express');
var template = require('../lib/template.js');
var db = require('../lib/db.js');
var router = express.Router();
var cookie = require('cookie');

function authIsOwner(request, response) {
    var isOwner = false;
    var cookies = {};
    if (request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie);
    }

    if (cookies.id === 'jschang0215' && cookies.pwd === '0215') {
        isOwner = true;
    }
    return isOwner;
}

function authStatusUI(request, response) {
    var isOwner = authIsOwner(request, response);
    var authStatusUI = `<a href="/login/login_page">Login</a><br>`;
    if (isOwner) {
        authStatusUI = `<a href="/login/logout_process">Logout</a><br>`
    }
    return authStatusUI;
}

router.get('/login_page', function (request, response) {
    db.query('SELECT * FROM topic', function (error, topics, fields) {
        var title = 'Login';
        var list = template.list(topics, title);
        var html = template.HTML(title, list, `
        <h3>${title}</h3>
        <ul>
            <form action="/login/login_process" method="post">
                <p><input type="text" name="id" placeholder="id"></p>
                <p><input type="password" name="pwd" placeholder="pwd"></p>
                <p><input type="submit" class="button"></p>
            </form>
        </ul>
        `, ` `, authStatusUI(request, response));
        response.writeHead(200);
        response.end(html);
    });
});

router.post('/login_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var pwd = post.pwd;

    if (id === 'jschang0215' && pwd == '0215') {
        response.writeHead(302, {
            'Set-Cookie': [
                `id=${id}; Path=/`,
                `pwd=${pwd}; Path=/`
            ],
            Location: `/`
        });
        response.end();
    } else {
        response.writeHead(302, {
            Location: `/`
        });
        response.end();
    }
});

router.get('/logout_process', function (request, response) {
    response.writeHead(302, {
        'Set-Cookie': [
            `id=; Max-Age=0; Path=/`,
            `pwd=; Max-Age=0; Path=/`
        ],
        Location: `/`
    });
    response.end();
});

module.exports = router;