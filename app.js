
var express = require('express'),
    jade = require('jade'),
    path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile); // .htmlはejsを利用
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
//app.use(favicon(path.join(__dirname, 'public', 'media', 'images', 'favicon.ico')));

// routers  --write here for a while
app.get('/', function (req, res) {
  res.render("index");
});

app.get('/photo', function (req, res) {
  res.render("photo/photo")
});

app.get('/paint', function (req, res) {
  res.render("paint/paint")
});

app.listen(3003, function () {
  console.log('app is listening at port 3003');
});