var dao = require('./Dao.js')
var mysql = require('sync-mysql')
var connection = new mysql(dao)
module.exports={
loadNote:function(){
  return connection.query(`select * from note`)
},
createNote:function(note){
  connection.query(`insert into note (id, contents, date, share) values(\'${note.id}\',\'${note.contents}\',\'${note.date}\',\'${note.share}\')`)
},
updateNote:function(note){
  connection.query(`update note set contents=\'${note.contents}\', share=\'${note.share}\' where id=\'${note.id}\' and date=\'${note.date}\'`)
},
deleteNote:function(id, date){
  connection.query(`delete from note where id=\'${id}\' and date=\'${date}\'`)
}
}
