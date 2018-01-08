/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-10-27T11:22:40+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Blog.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-11-22T16:28:43+08:00
 */
 var CircularJSON = require('circular-json');
 var dateFormat = require('dateformat');
 var mongoose = require('mongoose');
 const ObjectId = mongoose.Types.ObjectId

 var EventModel = require("../../models/Event");
 var Jimp = require("jimp");
 const limitNum = 10;

 function fetcheventlist(req, res) {
   var pageNum = req.body.pageNum;
   var option = {
     "limit": limitNum,
     "skip": limitNum * pageNum,
     "sort": "uid"
   }
   if(pageNum === 1) {
     var toplist = this.fetchmovetotoplist();
     var l = toplist.length;
     // TODO: 这里需要考虑第一次需要fetch toplist，并且补上剩下的几个空位
   }
   EventModel.find({}, option, function(err, docs){
     if(err) {
       res.send("Sorry, this operation failed, please try again.")
     } else {
       res.json(blog);
     }
   })
 }


 function eventdetail(req, res) {
   var blogId = req.query.blogId;
  //  console.log('blogid: ' + CircularJSON.stringify(req))

  //  BlogModel.findById(ObjectId(comment.blog_id)).populate('comments').exec(function(err, data){
  //    if(err) return err;
  //    console.log('updatedBlog: ' + data)
  //    res.send('bingo!')
  //  })
  console.log('loading blog detail...')

   EventModel.findById( ObjectId(blogId) ).populate('comments').exec(function(err, blog){
     if(err) return err;
     console.log('populated: ' + blog)
     res.json(blog)
   })
 }

 function usereventlist(req, res) {
   var data = req.body;
   var option = {
     "limit": limitNum,
     "skip": limitNum * pageNum,
     "sort": "uid"
   }
   EventModel.find( {uid: ObjectId(data.user.uid)}, option, function(err, docs){
     if(err) {
       res.send("Sorry, this operation failed, please try again.")
     } else {
       res.json(blog);
     }
   })
 }

//create new blog
 function newevent(req, res) {
  //  console.log("trying to process new blog from server side...")
   var now = new Date();
   now = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")
   var data = req.body.pack;
   var created_info = { time: now, device: data.device, location: { latitude: data.latitude || null, longitude: data.longitude || null, locationName: data.locationName || ''}}
   var blogEntity = new EventModel({
         uid: data.uid,
         category: data.category,
         anonymous: data.anonymous,
         content: { text: data.content, images: data.images || [] },
         created_info: created_info,
         movedToTop: data.movedToTop | false
   })
   blogEntity.save(function(err, docs){
       if(err) console.log(err);
       console.log('blog保存成功：' + docs);
       res.json(docs)
   })
  //  BlogModel.find(function(err, blog) {
  //  // if there is an error retrieving, send the error otherwise send data
  //      if (err){
  //        res.send("Sorry, this operation failed, please try again.")
  //      } else {
  //        res.json(blog);
  //      }
  //   })
  }

 function delevent(req, res) {
   var data = req.body;
   EventModel.findByIdAndRemove( ObjectId(data.blogId), function(err, data) {
     if (err){
       res.send("Sorry, this operation failed, please try again.")
     } else {
       res.send('Great, this blog has been successfully deleted.')
     }
   })
 }

function fetcheventdetail(req, res) {
  res.send('something')
}


 module.exports = {
   fetcheventlist,
   eventdetail,
   usereventlist,
   newevent,
   delevent,
   fetcheventdetail
 }
