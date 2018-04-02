/**
 * Module dependencies.
 */
var express = require('express'),
  http = require('http'),
  responseSize = require('../src/response-size');

/** Main app */  

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);  
  /*app.use(express.logger());*/
  app.use(express.bodyParser());
  app.use(responseSize({ threshold: 5, enable: true }));
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);

  app.use(express.cookieParser('your secret here'));
});

app.get('/', function(req, res) {
  res.send('coucou');
});

app.get('/json1', function(req, res) {
  var o = {};
  o.content = 'dsfsdfsdfjkhsdfkjhsdfj hdskjfhsdkjfhkjsdhfkjdshfhdskfhsdf'
  res.json(o);
});

// Server started
http.createServer(app).listen(app.get('port'), function(){
  console.log('info', 'Express server listening on port 3000');
});




