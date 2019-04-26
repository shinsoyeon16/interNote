var mDao = require('../../dao/memberDao.js')
var alertUtil = require('../alertUtil.js')
module.exports={
  execute: function(req,res,next){
    var followId = req.body.followId
    mDao.follow(req.session.user.id, followId)
    alertUtil.eventMsg(req,res,followId+"님을 팔로우하였습니다.")
  }
}
