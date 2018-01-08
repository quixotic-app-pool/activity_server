/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-11-22T17:54:18+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Session.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-11-22T18:13:38+08:00
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

var sessionSchema = new Schema({
    session: { type: String, default: ''},
    session_key: { type: String, default: ''},
    openid: { type: String, default: '' },
    expire_in: { type: Date, default: Date.now() },
    test_date: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Session', sessionSchema);
