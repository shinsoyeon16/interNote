var alertUtil = require('../alertUtil.js')
module.exports={
  execute: function(req,res,next){
    req.session.destroy(function(err){
      if(err){console.log('세션 삭제 에러'); return;}
      alertUtil.eventMsg(req,res,"로그아웃되었습니다.")
    })
  }
}
