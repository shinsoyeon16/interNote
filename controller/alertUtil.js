module.exports = {
eventMsg:function(req,res,msg){
    res.send(`<script type="text/javascript">alert(\'${msg}\');
    location.href='/';</script>`);
  }
}
