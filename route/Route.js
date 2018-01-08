/**
 * @Author: MichaelChen <mymac>
 * @Date:   2017-10-26T18:27:11+08:00
 * @Email:  teacherincafe@163.com
 * @Project: one_server
 * @Filename: Route.js
 * @Last modified by:   mymac
 * @Last modified time: 2018-01-08T18:44:13+08:00
 */
 var express = require('express');
 var dateFormat = require('dateformat');
 var crypto = require('crypto');
 var https = require('https');
 var CircularJSON = require('circular-json');
 var WXBizDataCrypt = require('../wechat_api/WXBizDataCrypt')
 var SessionModel = require('../models/Session')
 //nnd，multer 比较娇贵，只能走这了
 var path = require('path')
 var Jimp = require("jimp");
 var multer = require('multer');
 var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/../imageuploaded/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  var upload = multer({ storage: storage })

 var router = express.Router();


 var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 router.use(bodyParser.json());                                     // parse application/json
 router.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded


 var eventCtrl = require('./controller/Event');

 //Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('#################Welcome to server!######################')
  var now = new Date();
  console.log('Time: ', dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
  next();
});


//image files realted
router.post('/api/upload/image', upload.single('file'), function(req, res, next) {
  var filePath = __dirname + '/../imageuploaded/'
  var logoPath = __dirname + '/../assets/images/logo.png'
  var file= filePath + req.file.filename
  Jimp.read(file).then(function (img) {
      Jimp.read(logoPath).then(function(logoImg){
        img.resize(480, Jimp.AUTO)            // resize
           .quality(60)                 // set JPEG quality
           .composite(logoImg, 10 , 10)
           .write(file); // save
       })
    }).catch(function (err) {
       console.error(err);
   });
  var reply = { img: file}
  res.json(reply)
})

var token = "campusplan"; //此处需要你自己修改！
//wechat signature check
router.get('/api/wechatapi', function(req, res, next){
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;

  /*  加密/校验流程如下： */
  //1. 将token、timestamp、nonce三个参数进行字典序排序
  var array = new Array(token,timestamp,nonce);
  array.sort();
  var str = array.toString().replace(/,/g,"");
  //2. 将三个参数字符串拼接成一个字符串进行sha1加密
  var sha1Code = crypto.createHash("sha1");
  var code = sha1Code.update(str,'utf-8').digest("hex");

  //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if(code === signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
})

router.get('/api/wechatactivity', function(req, res){
      console.log('/api/wechatactivity: ' + req.query.code)
      // TODO: add appid
      // var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=&secret=cd3009e5b55bf60e4aa1ec95397b2016&js_code=' + req.query.code + '&grant_type=authorization_code'
      var back = res;
      var _3rd_session;
      https.get(url, res => {
          res.setEncoding("utf8");
          let body = "";
          res.on("data", data => {
            body += data;
          });
          res.on("end", () => {
            body = JSON.parse(body);
            console.log(body);
            // here we decode the data
            var pc = new WXBizDataCrypt('appid', body.session_key)
            var data = pc.decryptData(req.query['encrypted-data'] , req.query.iv)
            console.log('解密后 data: ', data)
            const exec = require('child_process').exec;
            exec('head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168', function(err,stdout,stderr){
              _3rd_session = stdout;
              console.log(typeof _3rd_session)
              console.log('3rd_session:' + stdout);
              var sessionEntity = new SessionModel({
                    session: _3rd_session,
                    session_key: body.session_key,
                    openid: body.openid,
                    // one day expiration time
                    expire_in: Date.now() + 86400000,
                  })
              sessionEntity.save(function(err, docs){
                  if(err) console.log(err);
                  console.log('session保存成功：' + docs);
                  back.send(_3rd_session)
              })
            })
          });
        });
})

//event
// router.post('/api/newevent', eventCtrl.newevent);
// router.get('/api/fetcheventlist', eventCtrl.fetcheventlist);
// router.get('/api/fetcheventdetail', eventCtrl.fetcheventdetail);
// router.post('/api/deleteevent', eventCtrl.deleteevent);


module.exports = router;
