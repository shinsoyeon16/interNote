var mDao = require('../../dao/memberDao.js')
var alertUtil = require('../alertUtil.js')
module.exports={
  execute: function(req,res,next){
    var post = req.body
    var id = post.id
    var password = post.password
    var name = post.name
    //유효성검사
    if(id=="" || password=="" || name=="") {
      alertUtil.eventMsg(req,res,"모든 항목을 입력하세요.")
    } else {
      var dbPassword = mDao.getPassword(id)
      if(dbPassword != -1) alertUtil.eventMsg(req,res,"이미 사용중인 아이디입니다.")
      else if(mDao.join({"id":id, "password":password, "name":name})){
        req.session.user = {"id":id}
        req.session.save(() => {
          res.redirect('/timeline')
        })
      }
      else alertUtil.eventMsg(req,res,"회원 가입 에러 발생")
    }
  }
}
