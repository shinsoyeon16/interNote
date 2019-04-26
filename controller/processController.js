var express = require('express')
var path = require('path')
var router = express.Router()
var login = require('./process/loginController.js')
var logout = require('./process/logoutController.js')
var join = require('./process/joinController.js')
var create = require('./process/createController.js')
var update = require('./process/updateController.js')
var remove = require('./process/removeController.js')
var follow = require('./process/followController.js')
var unfollow = require('./process/unfollowController.js')

router.post('/login', function(req,res,next){
  login.execute(req,res,next)
})
router.post('/logout', function(req,res,next){
  logout.execute(req,res,next)
})
router.post('/join', function(req,res,next){
  join.execute(req,res,next)
})
router.post('/create', function(req,res,next){
  create.execute(req,res,next)
})
router.post('/update', function(req,res,next){
  update.execute(req,res,next)
})
router.post('/remove', function(req,res,next){
  remove.execute(req,res,next)
})
router.post('/follow', function(req,res,next){
  follow.execute(req,res,next)
})
router.post('/unfollow', function(req,res,next){
  unfollow.execute(req,res,next)
})

module.exports= router;
