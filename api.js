var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var lookup = require('dns').lookup;
var Url = require('./model').Url;


var api = Object.create(null);

api.url = {
  find(url, callback) {
    Url.find({hostname: url}, callback);
  },
  create(url, callback) {
    var newUrl = new Url({hostname: url});
    newUrl.save(function(err, savedUrl) {
      if (err) {
        callback(true, err);
      } else {
        callback(false, savedUrl);
      }
    });
  }
};


router.use(bodyParser.urlencoded({extended: false}));

function checkValidUrl(url) {
  return new Promise(function (resolve, reject) {
    lookup(url, function (res) {      
      if (res.errcode === 'ENOTFOUND' && res.errno === 'ENOTFOUND') {
        reject(res.message);
      } else {
        resolve(res.hostname);
      }          
    });
  });
}

router.get('/home', function (req, res) {
    res.json({greeting: 'hello API'});
});

router.get('/shorturl/:shorturl', function(req, res, next) {
  // get shorturl's url from db
  // redirect
  // res.redirect(savedUrl);
});

router.post('/shorturl/new', function(req, res, next) {
  var url = req.body.url;
  // check valid url
  debugger;
  checkValidUrl(url)
    .then( validUrl => {
        // check db
        api.url.find(validUrl, function(err, arr) {
          if (arr.length === 0) {
            return Promise.resolve(validUrl);
          } else {
            return Promise.reject({ err: 'url already in db with id:' + arr[0]._id });
          }
        });        
    })
    .then( url => {
      api.url.create(url, function (err, savedUrl) {
        if (!err) {
          res.json(savedUrl);          
        } 
        next();
      });    
    })
    .catch( err => {
      res.json({
         err: err         
      });
      next();
    });
});

module.exports = router;
                      