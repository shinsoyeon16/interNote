var moment = require('moment');
module.exports = {
  HTML:function(id, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>InterNote</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1 style="display:inline">InterNote - <a href="/timeline">timeline</a>
    <div style="margin-right:20px; float:right; font-size:15px">
    ${id} 님 환영합니다.<form action="/logout_process" method="post" style="display:inline;">
    <input type="submit" value="로그아웃"></form>
    </div></h1>
    <hr style="border:dashed 1px lightgray">
    <form action="/timeline/create_process" method="post">
    <input type="hidden" name="filename" value=${moment().format("YYYYMMDDHHmmss")}>
    <textarea name="note" rows="3" cols="100" placeholder="오늘의 일기를 입력하세요."></textarea>
    <select name="share">
    <option value="everyone">전체공개</option>
    <option value="secret">나만보기</option>
    <option value="follow">친구공개</option>
    </select>
    <input type="submit" value="등록">
    </form><br><hr style="border:solid 2px black">
    ${body}
    </body>
    </html>
    `;
  },
  body:function(note, user, follows){
    var body = '<ul style="list-style:none;">';
    var i = 0;
    while(i < note.length){
      if(note[i].share=='everyone' || (note[i].share=='secret' && note[i].id==user.id) || (note[i].share=='follow' && follows.follows.includes(note[i].id)) || note[i].id==user.id){
        body = body + `
        <div style="float:left; padding:10px; width:100%;">
        <li>
        <div style="float:left; font-size:20px;">
        ${note[i].note}
        </div>
        <div style="float:right; align:left;font-size:13px;margin-right:10px;">
        <div style="float:right;display:block;width:150px">
        ${moment(note[i].date, "YYYYMMDDHHmmss").fromNow()}<br>`;
        if(note[i].id!==user.id){
          body = body + `작성자 : ${note[i].id}&nbsp;&nbsp;`;
          if(follows.follows.includes(note[i].id)){
            body = body + `<form action="/timeline/unfollow_process" method="post" style="display:inline-block;">`;
          }else{
            body = body + `<form action="/timeline/follow_process" method="post" style="display:inline-block;">`};
            body = body + `
            <input type="hidden" name="followId" value="${note[i].id}">
            <input type="submit" value="♥"></form></div>`;}
            else {
              body = body + `
              <div>
              <form action="/timeline/update" method="post" style="display:inline-block;">
              <input type="hidden" name="filename" value="${note[i].filename}">
              <input type="submit" value="수정">&nbsp;
              </form>
              <form action="/timeline/delete_process" method="post" style="display:inline-block;">
              <input type="hidden" name="filename" value="${note[i].filename}">
              <input type="submit" value="X">
              </form>
              </div>`;}
              body = body+`
              </div>
              </li>
              </div>
              <hr style="border:dashed 1px lightgray">
              `;
            }
            i = i + 1;
          }
          body = body+'</ul>';
          return body;
        },
        updateHTML:function(id, note, body){
          return `
          <!doctype html>
          <html>
          <head>
          <title>InterNote</title>
          <meta charset="utf-8">
          </head>
          <body>
          <h1 style="display:inline"><a href="/timeline">timeline</a>
          <div style="margin-right:20px; float:right; font-size:15px">
          ${id} 님 환영합니다.<form action="/logout_process" method="post" style="display:inline;">
          <input type="submit" value="로그아웃"></form>
          </div></h1>
          <hr style="border:dashed 1px lightgray">
          <form action="/timeline/update_process" method="post">
          <input type="hidden" name="filename" value=${note.filename}>
          <textarea name="note" rows="3" cols="100">${note.note}</textarea>
          <select name="share">
          <option value="everyone">전체공개</option>
          <option value="secret">나만보기</option>
          <option value="follow">친구공개</option>
          </select>
          <input type="submit" value="저장">  <input type="button" onclick="location.href='/'" value="돌아가기">
          </form><br><hr style="border:solid 2px black">
          ${body}
          </body>
          </html>
          `;
        },
      }
