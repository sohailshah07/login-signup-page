const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const connection = require('./connection');
const Model = require('./model');
const md5 = require('md5');
const userModule = require('./services/user');
const verifyToken = require('./verifyToken');
const multer = require('multer')
const upload = multer({ dest: "public/uploads/" })

app.post('/login', userModule.login);
app.post('/signup', upload.single("photo"), userModule.signup);
app.post('/changePassword', verifyToken, userModule.changePassword);
app.post('/getUserProfile', verifyToken, userModule.getUserProfile);
app.post('/editProfile', verifyToken, userModule.editProfile);

connection.connect();
app.listen(3000);
console.log('server listning at port 3000');

