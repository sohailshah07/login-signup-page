const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.jason());
const connection = require('./connection');
const userModel = require('./user');

//login page

//signup page