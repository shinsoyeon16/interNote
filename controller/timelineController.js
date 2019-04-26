var nDao = require('../dao/noteDao.js')
var mDao = require('../dao/memberDao.js')
var alertUtil = require('./alertUtil.js')
var template = require('../views/timelineTemplate.js')

module.exports={
  execute: function(req,res,next){
    if(! req.session.user) {
      alertUtil.eventMsg(req,res,"로그인 후 이용 가능합니다.")
    } else {
      // DB의 정보를 불러와 request.note 객체에 담는다
      var notes = []
      let rows = nDao.loadNote()
      rows.forEach(x => {
        notes = notes.concat({"id":x.id, "contents":x.contents, "date":x.date, "share":x.share})
      })

      // request.note 객체의 순서를 날짜별로 내림차순 정렬한다
      notes.sort((a,b) => {
        return b.date - a.date
      })
      req.note = notes;

      // DB로부터 follow 정보를 읽어들인 뒤, 세션에 저장한다
      req.session.follows = {"list":[]}
      var result = mDao.loadFollow(req.session.user.id)
      result.forEach(x => {
        req.session.follows.list.push(x.follow)
      })
      console.log(req.session.follows);
    }
  },
  timeline:function(req,res,next){
    var input = template.createInput()
    var body = template.body(req.note, req.session.user.id, req.session.follows)
    var html = template.HTML(req.session.user.id, input, body)
    res.send(html)
  },
  timelineUpdate:function(req,res,next){
    var id = req.body.id
    var date = req.body.date
    var note = req.note.find(x => x.id===id && x.date===date)
    var input = template.updateInput(note)
    var body = template.body(req.note, req.session.user.id, req.session.follows)
    var html = template.HTML(req.session.user.id, input, body)
    res.send(html)
  }
}
