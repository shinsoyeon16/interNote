/* 글정렬  CSS 완료

할것
-팔로우 기능
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
