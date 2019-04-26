var mDao = require('../../dao/memberDao.js')
var alertUtil = require('../alertUtil.js')
module.exports={
  execute: function(req,res,next){
    var post = req.body
    var id = post.id
    var password = post.password
    //유효성검사
    if(id=="" || password=="") {
      alertUtil.eventMsg(req,res,"모든 항목을 입력하세요.")
    } else {
      var dbPassword = mDao.getPassword(id)
      if(dbPassword == -1) alertUtil.eventMsg(req,res,"존재하지 않는 아이디 입니다.")
      else if(password !== dbPassword) alertUtil.eventMsg(req,res,"비밀번호가 다릅니다.")
      else if(password == dbPassword) {
        req.session.user = {"id":id}
        req.session.save(() => {
          res.redirect('/timeline')
        })
      }
    }
  }
}
