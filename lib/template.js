var moment = require('moment');
module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>InterNote</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h2><a href="/timeline">timeline</a></h2>
      <h4 style="text-align:right">ID 님 환영합니다.</h4>
      <hr>
      <form action="/timeline/create_process" method="post">
        <p><input type="hidden" name="title" value=${moment().format("YYYY-MM-DD-HH-mm-ss")}></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      <hr>
      ${list}
      ${body}
      ${control}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ol>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/timeline/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ol>';
    return list;
  }
}
