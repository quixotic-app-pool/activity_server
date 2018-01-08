/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-10-26T16:43:16+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Blog.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-11-20T10:16:22+08:00
 */
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 const ObjectId = mongoose.Schema.Types.ObjectId

 var eventSchema = new Schema({
     content: {
       text: String,
       images: [String]
     },
     user: { type: ObjectId, ref: 'user'},
     created_info: {
       time: {
    		 type   : String,
    		 default: '',
    	 },
       device: { type: String, default: null },
       location: {
         latitude: { type: Number, default: null },
         longitude: { type: Number, default: null },
         locationName: { type: String, default: '' }
       }
     }
 })

 module.exports = mongoose.model('Event', eventSchema);
