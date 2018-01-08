/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-11-01T09:44:53+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: User.js
 * @Last modified by:   mymac
 * @Last modified time: 2017-11-16T09:50:58+08:00
 */

  var UserModel = require("../../models/User")

  function screenuser(req, res) {
    var data = req.body;
    UserModel.findByIdAndUpdate( ObjectId(data.from_uid), { $push: { "screenUser": data.to_uid } }, function(err, data) {
      if (err){
        res.send("Sorry, this operation failed, please try again.")
      } else {
        res.send('Yes, you have successfully screened one user.')
      }
    })
  }

  module.exports = {
    screenuser
  }
