/* 글정렬  CSS 완료

할것

-공유기능
-mvc나누기
-발표자료
*/
var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser')
//var timelineRouter = require('./routes/timeline')
var indexRouter = require('./routes/index')
var helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('*',function(request,response,next){
  // 파일의 제목과 내용 읽은 후, request.note 에 객체로 저장하기
  // { filename: '20190425055041-a',
  //   note: '샬라샬라',
  //   id: 'a',
  //   date: 2019-05-24T20:50:41.000Z }
  request.list = fs.readdirSync('./notes');
  var notes = [];
  for(var i=0; i<request.list.length;i++){
  var note = fs.readFileSync(`notes/${request.list[i]}`, 'utf8');
  var headerInfo = request.list[i].split('-'); // filename정보를 '-'문자 기준으로 나눈다.
  notes = notes.concat({"filename":request.list[i], "note":note, "id":headerInfo[1],
  "date": headerInfo[0]});
    request.note = notes;
  }
  // note 객체를 내림차순으로 정렬하기
  request.note.sort(function(a,b){
    return b.date - a.date;
  })
  console.log(request.note);
  next();
})



//app.use('/timeline',timelineRouter);
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
});
