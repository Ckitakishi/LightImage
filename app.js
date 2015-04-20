
var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    favicon = require('serve-favicon');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile); // .htmlはejsを利用
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// routers  --write here for a while
app.get('/', function (req, res) {
  res.render("index");
});

app.get('/photo', function (req, res) {
  res.render("photo")
});

app.get('/paint', function (req, res) {
  res.render("paint")
});

app.get('/color', function (req, res) {
  res.render("color")
});

app.get('/about', function (req, res) {
  res.render("about")
});

app.listen(3003, function () {
  console.log('app is listening at port 3003');
});