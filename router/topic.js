var express = require('express');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var db = require('../lib/db.js');
var router = express.Router();

router.get('/create', function(request, response) {
    db.query('SELECT * FROM topic', function (error, topics, fields) {
        db.query('SELECT * FROM author', function (error, authors, fields) {
            var title = 'Create';
            var list = template.list(topics, title);
            var html = template.HTML(title, list, `
            <h3>${title}</h3>
            <ul>
                <form action="/topic/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    ${template.authorsSelect(authors, 1)}
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    <p><input type="submit" class="button"></p>
                </form>
            </ul>
            `, ` `);
            response.writeHead(200);
            response.end(html);
        });
    });
});

router.post('/create_process', function(request, response) {
    var post = request.body;
    var title = post.title;
    var sanitizedTitle = sanitizeHtml(title);
    var description = post.description;
    var sanitizedDescription = sanitizeHtml(description);

    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, 
    [sanitizedTitle, sanitizedDescription, post.author], function (error, result, fields) {
        if(error) {
        throw error;
        }
        response.writeHead(302, {Location: `/topic/${result.insertId}`});
        response.end('Succcss');
    });
});

router.get('/update/:topicId', function(request, response) {
    var sanitizedId = sanitizeHtml(request.params.topicId);
    db.query('SELECT * FROM topic', function (error,topics, fields) {
        if(error) {
            throw error;
        }
        db.query('SELECT * FROM topic WHERE id=?', [sanitizedId], function (error2, topic, fields) {
            if(error2) {
            throw error2;
            }
            db.query('SELECT * FROM author', function (error3, authors, fields) {
            if(error3) {
                throw error3;
            }
            var title = topic[0].title;
            var list = template.list(topics, title);
            var description = topic[0].description;
            var html = template.HTML(title, list, `
            <h3>${title} - update</h3>
            <ul>
                <form action="/topic/update_process" method="post">
                    <p><input type="hidden" name="id" value="${sanitizedId}"></p>
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    ${template.authorsSelect(authors, topic[0].author_id)}
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit"></p>
                </form>
            </ul>
            `, ` `);
            response.writeHead(200);
            response.end(html);
            });
        });
    });
});

router.post('/update_process', function(request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var sanitizedTitle = sanitizeHtml(title);
    var description = post.description;
    var sanitizedDescription = sanitizeHtml(description);
    var filteredId = path.parse(id).base;

    db.query('UPDATE topic SET title=?, description=?, created=NOW(), author_id=? WHERE id=?', 
    [sanitizedTitle, sanitizedDescription, post.author, id], function (error, result, fields) {
        if(error) {
        throw error;
        }
        response.writeHead(302, {Location: `/topic/${id}`});
        response.end('Succcss');
    });
});

router.post('/delete_process', function(request, response) {
    var post = request.body;
    var id = post.id;
    db.query('DELETE FROM topic WHERE id=?', [id], function (error,topics, fields) {
        if(error) {
        throw error;
        }
        response.writeHead(302, {Location: `/`});
        response.end('Succcss');
    });
});

router.get('/:topicId', function(request, response) {
    var sanitizedId = sanitizeHtml(request.params.topicId);
    db.query('SELECT * FROM topic', function (error, topics, fields) {
        if (error) {
            throw error;
        }
        db.query('SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?', [sanitizedId], function (error2, topic) {
            if(error2) {
                throw error2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var sanitizedDescription = sanitizeHtml(description);
            var sanitizedTitle = sanitizeHtml(title);
            var list = template.list(topics, title);
            var html = template.HTML(sanitizedTitle, list, `
            <h3>${sanitizedTitle}</h3>
            <ul>
                ${sanitizedDescription}
            </ul>
            <br>
            <h5>written by ${topic[0].name}</h5>
            `, `
            <a href="/topic/update/${sanitizedId}">Update</a>
            <form action="/topic/delete_process" method="post" onclick="alert('Do you really want to delete?')">
            <input type="hidden" name="id" value="${sanitizedId}">
            <input type="submit" class="button"  value="Delete">
            </form>
            `);
            response.send(html);
        });
    });
});

module.exports = router;