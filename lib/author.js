var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./template.js');
var db = require('./db.js');
const { authorTable } = require('./template.js');

exports.home = function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) {
            throw error;
        }
        db.query('SELECT * FROM author', function (error2, authors) {
            if(error2) {
                throw error2;
            }
            var list = template.list(topics, '/');
            var title = 'Author';
            var html = template.HTML(title, list, `
                ${template.authorTable(authors)}
                <style>
                table {
                    border-collapse: collapse;
                }
                td {
                    border: 1px black solid;
                    padding: 5px;
                    text-align: center;
                }
                </style>
                <br>
                <form action="author/create_process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p><textarea name="profile" placeholder="profile"></textarea></p>
                <p><input type="submit" class="button"></p>
                </form>
                `, `  `);
            response.writeHead(200);
            response.end(html);
        });
        
    });
}

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
        // Security
        if(body.length>1e8) {
            request.connection.destroy();
        }
    });
    request.on('end', function() {
        var post = qs.parse(body);
        var title = post.title;
        var sanitizedTitle = sanitizeHtml(title);
        var description = post.description;
        var sanitizedDescription = sanitizeHtml(description);

        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, 
        [post.name, post.profile], function (error, result, fields) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end('Succcss');
        });
    });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function (error,topics, fields) {
        if(error) {
            throw error;
        }
        db.query('SELECT * FROM author WHERE id=?', [queryData.id], function (error2, author, fields) {
            if(error2) {
            throw error2;
            }
            var name = author[0].name;
            var list = template.list(topics, name);
            var profile = author[0].profile;
            var html = template.HTML(name, list, `
            <h3>${name} - update</h3>
            <ul>
                <form action="/author/update_process" method="post">
                    <p><input type="hidden" name="id" value="${queryData.id}"></p>
                    <p><input type="text" name="name" placeholder="name" value="${name}"></p>
                    <p><textarea name="profile" placeholder="profile">${profile}</textarea></p>
                    <p><input type="submit"></p>
                </form>
            </ul>
            `, ` `);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        var name = post.name;
        var sanitizedName = sanitizeHtml(name);
        var profile = post.profile;
        var sanitizedProfile = sanitizeHtml(profile);
        var filteredId = path.parse(id).base;

        db.query('UPDATE author SET name=?, profile=? WHERE id=?', 
        [sanitizedName, sanitizedProfile, id], function (error, result, fields) {
            if(error) {
            throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end('Succcss');
        });
    });
}

exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        db.query('DELETE FROM author WHERE id=?', [filteredId], function (error,topics) {
            if(error) {
                throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end('Succcss');
        });
    });
}
