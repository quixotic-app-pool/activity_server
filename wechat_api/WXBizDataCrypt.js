/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-10-27T09:41:17+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: WXBizDataCrypt.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-10-27T12:17:51+08:00
 */

 var crypto = require('crypto')

 function WXBizDataCrypt(appId, sessionKey) {
   this.appId = appId
   this.sessionKey = sessionKey
 }

 WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
   // base64 decode
   var sessionKey = new Buffer(this.sessionKey, 'base64')
   encryptedData = new Buffer(encryptedData, 'base64')
   iv = new Buffer(iv, 'base64')

   try {
      // 解密
     var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
     // 设置自动 padding 为 true，删除填充补位
     decipher.setAutoPadding(true)
     var decoded = decipher.update(encryptedData, 'binary', 'utf8')
     decoded += decipher.final('utf8')

     decoded = JSON.parse(decoded)

   } catch (err) {
     throw new Error('Illegal Buffer')
   }

   if (decoded.watermark.appid !== this.appId) {
     throw new Error('Illegal Buffer')
   }

   return decoded
 }

 module.exports = WXBizDataCrypt
