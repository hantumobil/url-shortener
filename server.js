'use strict';
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var api = require('./api');
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// added in ./model.js

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.use('/api', api);

app.listen(port, function () {
  console.log('Node.js listening ...');
});