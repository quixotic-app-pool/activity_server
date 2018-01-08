/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-10-26T16:43:33+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: User.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-11-20T10:17:52+08:00
 */


 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var userSchema = new Schema({
     nickName: String,
     avatar: String,
     createdEvents: [{ type: ObjectId, ref: 'event' }],
     joinedEvents: [{ type: ObjectId, ref: 'event' }]
 })
 module.exports = mongoose.model('User', userSchema);
