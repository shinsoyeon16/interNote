/* 로그인 회원가임 동기코드로 변경완료
할것

로그인세션정보
글 내용 보이게 리스트만들기
글 수정/삭제
글목록 정렬

-공유기능
-mvc나누기
-발표자료
*/
var express = require('express') //모듈을 로드해 오는 코드
var app = express() //express모듈자체는 app이라는 객체를 리턴해준다.
var fs = require('fs');
var bodyParser = require('body-parser') //바디파서미들웨어
//var timelineRouter = require('./routes/timeline')
var indexRouter = require('./routes/index')
var helmet = require('helmet');

app.use(helmet()); // 헬멧 미들웨어를 로드
app.use(bodyParser.urlencoded({ extended: false })); //바디파서 미들웨어 시작=
app.get('*',function(request,response,next){ //*모든요청이 아닌 겟방식으로 들어오는 요청으로 인해 파일목록을 가져온다
  fs.readdir('./notes',function(error,filelist){
    request.list = filelist;
    next();
  })
});
//app.get('/', (req, res) => res.send('Hello World!')) //get인자1은 path 값 , 인자2는 콜백함수
//app.use('/timeline',timelineRouter); // /topic으로 시작하는 주소들에게 topic라우터라는 이름의 미들웨어를 적용하겠다.
app.use('/',indexRouter);


 app.use(function(req, res, next) {
   res.status(404).send('404 - Sorry cant find that!');
 });

 app.use(function (err, req, res, next) {
   console.error(err.stack)
   res.status(500).send('500 - Something broke!')
 });

app.listen(3000, function() {
  console.log(`InterNode listening on port 3000!`)
}); //app객체에 listen이라는 함수에 첫번째인자로 3000을 주면 ,listen 함수가 실행될 때 웹서버가 실행됨
