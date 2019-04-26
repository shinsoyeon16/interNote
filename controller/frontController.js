var express = require('express')
var path = require('path')
var router = express.Router()
var process = require('./processController.js')
var timeline = require('./timelineController.js')
router.use('/process',process)

// 메인 페이지
router.get('/',function(req, res, next){
  if(req.session.user){
    res.redirect(`/timeline`);
  } else {
    res.render('mainView');
  }
})

// 타임라인 페이지
router.get('/timeline', function(req,res,next){
  timeline.execute(req,res,next)
  timeline.timeline(req,res,next)
 })

 // 타임라인 업데이트 페이지
 router.post('/update', function(req,res,next){
   timeline.execute(req,res,next)
   timeline.timelineUpdate(req,res,next)
  })

module.exports= router;
