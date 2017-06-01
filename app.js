var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var mongoose = require('mongoose');

var client = require('./routes/client')

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost:27017/sda");

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/client', client)

app.get("/", function(req, res){
  res.json({message:'Welcome to Solari Panel DB!'})
})

app.all('*', function(req, res) {
  res.redirect("/");
});

module.exports = app
