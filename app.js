const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
const connection = require('./connection');
const Model = require('./model');
const md5 = require('md5');

const userModule = require('./services/user')

//login page
app.post('/login', userModule.login);
//signup page
app.post('/signup', userModule.signup);

connection.connect();

app.listen(3000);
console.log('server listning at port 3000');

