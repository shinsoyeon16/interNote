var nDao = require('../../dao/noteDao.js')
module.exports={
  execute: function(req,res,next){
    var id = req.body.id
    var date = req.body.date
    nDao.deleteNote(id, date)
    res.redirect(`/timeline`);
  }
}
