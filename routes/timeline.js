var express = require('express') //로딩시키기
var router = express.Router() //express가 갖고 있는 라우터 메소드호출 라우터라는 객체를 리턴
var template = require('../lib/template.js'); //..현재디렉터리의 부모디렉터리로 이동
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');
var session = require('express-session');

router.use(session({
  secret: 'aaaa',
  resave: false,
  saveUninitialized: true
}))
router.get('/', function(request,response){
  // if(request.session.user){
  request.session.user={"id":'id'};
    var body = template.body(request.note);
    var html = template.HTML(request.session.user.id, body);
    response.send(html);
  // } else {
  //   response.send(`<script type="text/javascript">alert(\'로그인 후 이용가능합니다.\');
  //   location.href='/';</script>`);
  // }
})

router.post('/create_process',function(request,response){ //보낼때
  var post = request.body;
  var filename = post.filename;
  var note = post.note;
  fs.writeFile(`notes/${filename}-${request.session.user.id}`, note, 'utf8', function(err){
    response.redirect(`/timeline`);
  })
})

router.post('/update', function(request, response,next){
  var post = request.body;
  var filename = post.filename;
  var note = request.note.find(x => x.filename === filename).note;
  var html = template.updateHTML(request.session.user.id, filename,note, ``
  );
  response.send(html)
})

router.post('/update_process',function(request,response){
  var post = request.body;
  var filename = post.filename;
  var note = post.note;
  fs.writeFile(`notes/${filename}`, note, 'utf8', function(err){
    response.redirect(`/timeline`)
  })
})

router.post('/delete_process',function(request,response){
  var post = request.body;
  fs.unlink(`notes/${post.filename}`, function(error){
    response.redirect('/')
  })
})

module.exports = router; //라우터가 export 된다.
