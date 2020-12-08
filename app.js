const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.jason());
const connection = require('./connection');
const userModel = require('./user');

//login page
app.post('/login', async function (req, res) {
    console.log('logging req----', req.body);
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.send('Parameter Missing or parameter type is wrong.')
    }
    else {
        const isUserExists = await UserModel.findOne({ email: email });
        if (isUserExists == null) {
            res.send('user with this email is not registerd with us. Try signnin in with another email.')
        } else {
            if (isUserExists.password != password) {
                res.send('password is wrong. Please enter correct passord');
            } else {
                res.send('Login Successfull');
            }
        }
    }
});
//signup page
app.post('/signup', async function (req, res) {
    console.log('logging req----', req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password || !firstName) {
        res.send('Parameter Missing or Parameter type is wrong');
    }
    else {
        const ifEmailExist = await UserModel.findOne({ email:email });
        console.log('------ifEmailExist---', ifEmailExist)
        if (!ifEmailExist) {
            dataObj = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }

            console.log('-------dataObje-----', dataObj);

            const save = await UserModel.create(dataObj);
            console.log('-----save----', save);
            res.send('Successfully signed up.');
        }
        else {
            console.log('-----ifEmail inside else block----', ifEmailExist);
            res.send('user with this email alredy exist please use different email')
        }
    }
});

connection.connect();

app.listen(3000);
console.log('server listning at port 3000');

