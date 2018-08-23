var mongo = require('mongodb');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var lookup = require('dns').lookup;

mongoose.connect(process.env.MONGO_URI);

router.use(bodyParser.urlencoded({extended: false}));

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
  debugger;
  // check valid url
  lookup(url, function (err, addresses, family) {
    console.log(err, addresses, family, arguments);
    if (!err) {
      // url valid process saving to db
      
      
    } else {
       res.json({
         err: err,
         addresses: addresses,
         family: family
       });
    }
    
  });
});

module.exports = router;
                      