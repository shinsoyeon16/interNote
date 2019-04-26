var nDao = require('../../dao/noteDao.js')
module.exports={
  execute: function(req,res,next){
    var post = req.body
    var date = post.date
    var contents = post.contents
    var share = post.share
    var note = {"id":req.session.user.id, "contents":contents, "date":date, "share":share}
    nDao.createNote(note)
    res.redirect(`/timeline`);
  }
}
