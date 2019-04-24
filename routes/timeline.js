var express = require('express') //로딩시키기
var router = express.Router() //express가 갖고 있는 라우터 메소드호출 라우터라는 객체를 리턴
var template = require('../lib/template.js'); //..현재디렉터리의 부모디렉터리로 이동
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var fs = require('fs');

router.get('/', function(request,response){
  var title = '이야기를 써주세욤';
  var description = '';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}`, ``);
  response.send(html);
})

router.get('/create',function(request,response){ //가져올때
     var title = 'WEB - create';
     var list = template.list(request.list);
     var html = template.HTML(title, list, `
       <form action="/timeline/create_process" method="post">
         <p><input type="hidden" name="title" value=${moment().format("YYYY-MM-DD-HH-mm-ss")}></p>
         <p>
           <textarea name="description" placeholder="description"></textarea>
         </p>
         <p>
           <input type="submit">
         </p>
       </form>
     `, '');
     response.send(html);
   });

router.post('/create_process',function(request,response){ //보낼때
     var post = request.body;
     var title = post.title;
     var description = post.description;
     fs.writeFile(`notes/${title}`, description, 'utf8', function(err){
       response.redirect(`/timeline/${title}`);
     })
   });

router.get('/:pageId',function(request,response,next){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`notes/${filteredId}`, 'utf8', function(err, description){
      if(err){
        next(err);
      }else{
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/timeline/update/${sanitizedTitle}">update</a>
            <form action="/timeline/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
      }

    });
});

router.get('/create',function(request,response){ //가져올때
       var title = 'WEB - create';
       var list = template.list(request.list);
       var html = template.HTML(title, list, `
         <form action="/timeline/create_process" method="post">
           <p><input type="text" name="title" placeholder="title"></p>
           <p>
             <textarea name="description" placeholder="description"></textarea>
           </p>
           <p>
             <input type="submit">
           </p>
         </form>
       `, '');
       response.send(html);
     });

router.post('/create_process',function(request,response){ //보낼때
  var post = request.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`notes/${title}`, description, 'utf8', function(err){
    response.redirect(`/timeline/${title}`);

  })
});

router.get('/update/:pageId',function(request,response){
       var filteredId = path.parse(request.params.pageId).base;
       fs.readFile(`notes/${filteredId}`, 'utf8', function(err, description){
         var title = request.params.pageId;
         var list = template.list(request.list);
         var html = template.HTML(title, list,
           `
           <form action="/timeline/update_process" method="post">
             <input type="hidden" name="id" value="${title}">
             <p><input type="text" name="title" placeholder="title" value="${title}"></p>
             <p>
               <textarea name="description" placeholder="description">${description}</textarea>
             </p>
             <p>
               <input type="submit">
             </p>
           </form>
           `,
           `<a href="/timeline/create">create</a> <a href="/timeline/update/${title}">update</a>`
         );
         response.writeHead(200);
         response.end(html);
       });
});

router.post('/update_process',function(request,response){
       var post = request.body;
       var id = post.id;
       var title = post.title;
       var description = post.description;
       fs.rename(`notes/${id}`, `notes/${title}`, function(error){
         fs.writeFile(`notes/${title}`, description, 'utf8', function(err){
           response.redirect(`/timeline/${title}`);
         });
       });
   });


router.post('/delete_process',function(request,response){
     var post = request.body;
     var id = post.id;
     var filteredId = path.parse(id).base;
     fs.unlink(`notes/${filteredId}`, function(error){
      response.redirect('/');
     })
 });

 module.exports = router; //라우터가 export 된다.
