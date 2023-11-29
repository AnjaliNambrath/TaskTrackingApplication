const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require("cors");
require('colors')
User = require('./models/userModel')
jsonwebtoken = require("jsonwebtoken");

const routes = require('./routes/task')
const url = require('./config/config')

const app = express();
const port = 5000;
app.use(express.static('./public'));
app.use(cors())
mongoose.connect(url)
console.log("MongoDB Connection Successful".yellow.underline.bold);

app.use(bodyParser.json())

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use(routes)

app.listen(port,()=>{
    console.log("Server Listening on port 5000".green.underline.bold);
})