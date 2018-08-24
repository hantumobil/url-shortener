var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var lookup = require('dns').lookup;
var Url = require('./model').Url;


var api = Object.create(null);

api.url = {
    findShortUrl(shortUrl) {
        return new Promise(function (resolve, reject) {
            Url.find({
                short_url: shortUrl
            }, function (err, arr) {
                if (!err) {
                    resolve(arr[0])
                } else {
                    reject(err);
                }
            });
        });
    },
    find(url) {
        return new Promise(function (resolve, reject) {
            Url.find({
                original_url: url
            }, function (err, arr) {
                if (!err) {
                    resolve(arr);
                } else {
                    reject(err);
                }
            });
        });
    },
    create(url) {
        var newUrl = new Url({
            original_url: url
        });
        return new Promise(function (resolve, reject) {
            newUrl.save(function (err, savedUrl) {
                if (!err) {
                    resolve(savedUrl);
                } else {
                    reject(err);
                }
            });
        });
    }
};


router.use(bodyParser.urlencoded({
    extended: false
}));

function checkValidUrl(url) {
    return new Promise(function (resolve, reject) {
        lookup(url, {
            all: true
        }, function (err, addresses) {
            if (addresses.length !== 0) {
                resolve(url);
            } else {
                reject(err);
            }
        });
    });
}

router.get('/home', function (req, res) {
    res.json({
        greeting: 'hello API'
    });
});

router.get('/shorturl/:shorturl', function (req, res, next) {
    // get shorturl's url from db    
    const shortUrl = req.params.shorturl;
    api.url.findShortUrl(shortUrl)
        .then(data => {
            res.redirect(data.original_url);
        })
        .catch(err => {
            res.json(err);
            console.error(err);
        });
});

router.post('/shorturl/new', function (req, res, next) {
    var url = req.body.url;
    checkValidUrl(url)
        .then(validUrl => {
            return api.url.find(validUrl);
        })
        .then(urls => {
            if (urls.length === 0) {
                return api.url.create(url);
            } else {
                return Promise.reject(urls[0]);
            }
        })
        .then(savedUrl => {
            console.log('url saved: ', savedUrl);
            res.json({
                original_url: savedUrl.original_url,
                short_url: savedUrl.short_url
            });
            next();
        })
        .catch(err => {
            res.json(err);
            next();
        });
});

module.exports = router;