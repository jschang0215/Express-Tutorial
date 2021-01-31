module.exports = {
  HTML: function (title, list, body, control, authStatusUI) {
      return `
      <!DOCTYPE html>
      <html>
          <head>
              <title>JSChang - ${title}</title>
              <meta charset="utf-8">
              <link rel="stylesheet" href="/style/style.css">
              <script src="/script/color.js"></script>
              <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          </head>
          <body>
              <h1><a href="/">JSChang</a></h1>
              <input type="button" class="button" id="night_day" value="Night" onclick="nightDayHandler(this)">
              <br><br>
              ${authStatusUI}
              <a href="/author">Author</a>
              <div id="grid">
                  ${list}
                  <div id="article">
                  ${control}
                  <br><br>
                  ${body}
                  </div>
              </div>
          </body>
      </html>
      `
  },
  list: function (topics, title) {
      var list = '<ol>'
      for(var i=0; i<topics.length; i++) {
          if(!(topics[i].title).startsWith(".")) {
              if(topics[i].title === title) {
                  list += `<li><a href="/topic/${topics[i].id}" class="cur">${topics[i].title}</a></li>`;
              } else {
                list += `<li><a href="/topic/${topics[i].id}" class="saw">${topics[i].title}</a></li>`;
              }
          }
      }
      list +='</ol>'
      return list;
  },
  authorsSelect: function(authors, author_id) {
    var tag = '';
    for(var i=0; i<authors.length; i++) {
        var selected = '';
        if(authors[i].id === author_id) {
            selected = 'selected';
        }
      tag += `<option value="${authors [i].id}" ${selected}>${authors[i].name}</option>`;
    }
    return `
    <p>
    <select name="author">
        ${tag}
    </select>
    </p>
    `;
  },
  authorTable: function(authors) {
      var tag = '<table>';
      for(var i=0; i<authors.length; i++) {
          tag +=`<tr>
          <td>${authors[i].name}</td>
          <td>${authors[i].profile}</td>
          <td><a href="/author/update?id=${authors[i].id}">Update</a></td>
          <td>
          <form action="/author/delete_process" method="post" onclick="alert('Do you really want to delete?')">
          <input type="hidden" name="id" value="${authors[i].id}">
          <input type="submit" class="button"  value="Delete">
          </form>
          </td>
          </tr>`
      }
      tag += '</table>';
      return tag;
  }
};