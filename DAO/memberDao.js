var dao = require('./Dao.js')
var mysql = require('sync-mysql')
var connection = new mysql(dao)
module.exports={
  getPassword:function(id){
    let result = connection.query(`select password from member where id=\'${id}\'`);
    if(result[0]==undefined) return -1
    else return  result[0].password
  },
  join:function(user){
    connection.query(`insert into member(id, password, name) values (\'${user.id}\',\'${user.password}\',\'${user.name}\')`);
    return 1;
  },
  loadFollow:function(id){
    let result = connection.query(`select follow from follow_member where id=\'${id}\'`)
    return result
  },
  follow:function(id, followId){
    connection.query(`insert into follow_member values(\'${id}\', \'${followId}\')`)
  },
  unfollow:function(id, followId){
    connection.query(`delete from follow_member where id=\'${id}\' and follow=\'${followId}\'`)
  }
}
