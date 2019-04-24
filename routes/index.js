var express = require('express')
var router = express.Router();
var path = require('path');
var qs = require('querystring');
var memberDao = require('../DAO/memberDao.js');
var mysql = require('mysql');
var timelineRouter = require('./timeline')
var connection = mysql.createConnection(memberDao);

router.use('/timeline',timelineRouter);
router.get('/',function(request,response){
  var title = 'InterNote';
  var description = 'Hello, interNote';
  response.send(
    `
    <!doctype html>
    <html>
    <head>
    <title>InterNote</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h2>${title}</h2>${description}
    <form action = "/login_process" method="post">
    <input type="text" name="id" placeholder="ID">
    <input type="password" name="password" placeholder="PASSWORD">
    <input type="submit" value="로그인">
    </form>
    <br><hr><br>
    <form action = "/join_process" method="post">
    <input type="text" name="id" placeholder="ID">
    <input type="password" name="password" placeholder="PASSWORD">
    <input type="text" name="name" placeholder="NAME">
    <input type="submit" value="회원가입">
    </form>
    </body>
    </html>
    `);
  });
  router.post('/login_process',function(request,response,next){
    var post = request.body;
    var id = post.id;
    var password = post.password;

    function isIdValid(password, callback) {
      connection.query(`select password from member where id=\'${id}\'`, function(err,rows,fields){
        if(err) throw err;
        else {
          if(rows[0]!==undefined) callback(password, rows[0]);
          else callback(password, -1);
        }
      })
    }
    //redirect 와 send 는 동시에 응답할 수 없기 때문에 강제주소변환을 위해 location.href 사용
    function errorMsg(msg){
      response.send(`<script type="text/javascript">alert(\'${msg}\');
      location.href='/';</script>`);
    }
    function isPasswordWrong(password, data){
      var dbPassword = data.password;
      if(data==-1) errorMsg("존재하지 않는 아이디 입니다.");
      else if(password !== dbPassword) errorMsg("비밀번호가 다릅니다.");
      else if(password == dbPassword) response.redirect(`/timeline`);
    }

    //유효성검사
    if(id=="" || password=="") errorMsg("모든 항목을 입력하세요.");
    //모든칸을 입력한 경우, 아이디 중복체크 하기
    else isIdValid(password, isPasswordWrong);

    //비동기 소스 수정전
    /*  connection.connect();
    connection.query(`select password from member where id=\'${id}\'`, function(err,rows,fields){
    if(err) console.log('디비에러');
    else{
    callback(rows[0]);
    var data=rows[0];
    if(data==null){
    msg="존재하지 않는 아이디 입니다.";
  }
  else dbPassword = data.password;

  //모든 항목에 값을 입력한 경우
  if(password !== dbPassword){
  msg="비밀번호가 다릅니다.";
}
else if(password == dbPassword){
response.redirect(`/timeline`);
}
}
console.log('1');
}, function());
console.log('2');
connection.end();
console.log('3');
}
if(msg) {
console.log(msg);
response.redirect(`/`);
//response.send(`<script type="text/javascript">alert(\'${msg}\');</script>`);
}
*/
});

router.post('/join_process',function(request,response,next){
  var post = request.body;
  var id = post.id;
  var password = post.password;
  var name = post.name;

  function isIdValid(callback) {
    connection.query(`select * from member where id=\'${id}\'`, function(err,rows,fields){
      if(err) throw err;
      else {
        if(rows[0]!==undefined) errorMsg("이미 사용중인 아이디입니다.");
        else callback();
      }
    });
  }
  function errorMsg(msg){
  response.send(`<script type="text/javascript">alert(\'${msg}\');
    location.href='/';</script>`);
  }
  function joinMember(){
    connection.query(`insert into member(id, password, name) values (\'${id}\',\'${password}\',\'${name}\')`, function(err,rows,fields){
      if(err) console.log('가입 디비 에러');
      else errorMsg("가입이 완료되었습니다.");
    })
  }

  //유효성검사
  if(id=="" || password=="" || name=="") errorMsg("모든 항목을 입력하세요.");
  //모든칸을 입력한 경우, 아이디 중복체크 하기
  else isIdValid(joinMember);
});

module.exports= router;
