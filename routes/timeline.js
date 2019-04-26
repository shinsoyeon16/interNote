var express = require('express') //로딩시키기
var router = express.Router() //express가 갖고 있는 라우터 메소드호출 라우터라는 객체를 리턴
var template = require('../lib/template.js'); //..현재디렉터리의 부모디렉터리로 이동
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');
var session = require('express-session');
var memberDao = require('../DAO/memberDao.js');
var mysql = require('mysql');
var connection = mysql.createConnection(memberDao);

router.use(session({
  secret: 'aaaa',
  resave: false,
  saveUninitialized: true
}))
router.use('*',function(request,response,next){
  if(!request.session.user){
    response.send(`<script type="text/javascript">alert(\'로그인 후 이용가능합니다.\');
    location.href='/';</script>`);
  } else {
  // 파일의 제목과 내용 읽은 후, request.note 에 객체로 저장하기
  /*
  filename: '20190425094056-a',
  note: 'ㅎㅎ오늘날씨 맑음',
  id: 'a',
  date: '20190425094056',
  share: 'everyone'}
  */
  request.list = fs.readdirSync('././notes');
  var notes = [];
  for(var i=0; i<request.list.length;i++){
    var note = fs.readFileSync(`notes/${request.list[i]}`, 'utf8');
    var headerInfo = request.list[i].split('-'); // filename정보를 '-'문자 기준으로 나눈다.
    notes = notes.concat({"filename":request.list[i], "note":note, "id":headerInfo[1],
    "date": headerInfo[0], "share":headerInfo[2]});
    request.note = notes;
  }
  // note 객체를 내림차순으로 정렬하기
  request.note.sort(function(a,b){
    return b.date - a.date;
  })
    // id 값을 사용하여 follow정보를 DB로부터 읽어들인 뒤, 세션에 follows 정보 저장
    connection.query(`select * from follow_member where id=\'${request.session.user.id}\'`, function(err,rows,fields){
      if(err) throw err;
      else {
        rows.forEach(data => {
          request.session.user.follows.push(data.follow);
        })
      }
    })
  next();
}
})
router.get('/', function(request,response){
    var body = template.body(request.note, request.session.user);
    var html = template.HTML(request.session.user.id, body);
    response.send(html);
})

router.post('/create_process',function(request,response){ //보낼때
  var post = request.body;
  var filename = post.filename;
  var note = post.note;
  fs.writeFile(`notes/${filename}-${request.session.user.id}-${post.share}`, note, 'utf8', function(err){
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
