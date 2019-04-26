/*
할것

@@로그인세션정보
@@글 내용 보이게 리스트만들기
@@글 수정/삭제
@@글목록 정렬
@@공유기능
@@팔로우 기능
@@파일 디비로 바꾸기
@@mvc나누기
-발표자료

*/
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var helmet = require('helmet')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var dao = require('./dao/Dao.js')
var sessionStore = new MySQLStore(dao)
var frontController = require('./controller/frontController.js')

app.use(session({
  secret: 'session_cookie_name',
  resave: false,
  store: sessionStore,
  saveUninitialized: true
}))
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug')
app.set('views','./views')
app.use('/', frontController)

// 오류 페이지
app.use(function(req, res, next) {
  res.status(404).send('404 - Sorry cant find that!');
})
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('500 - Something broke!')
})

app.listen(3000, function() {
  console.log(`InterNode listening on port 3000!`)
})
