const Model = require('../model');
const md5 = require('md5');

//login api
exports.login = login;

async function login(req, res) {
    // console.log('logging req----', req.body);
    const email = req.body.email;
    const password = md5(req.body.password);
    console.log('--------psw--------',password);
    if (!email || !password) {
        res.send('Parameter Missing or parameter type is wrong.')
    }
    else {
        const isUserExists = await Model.UserModel.findOne({ email: email });
        if (isUserExists == null) {
            res.send('user with this email is not registerd with us. Try signnin in with another email.')
        } else {
            if (isUserExists.password != password) {
                res.send('password is wrong. Please enter correct passord');
            } else {
                res.send({message: "Login Successfull", data: isUserExists});
            }
        }
    }
}

//signup api
exports.signup = signup;

async function signup(req, res) {
    console.log('logging req----', req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = md5(req.body.password);
    if (!email || !password || !firstName) {
        res.send('Parameter Missing or Parameter type is wrong');
    }
    else {
        const ifEmailExist = await Model.UserModel.findOne({ email: email });
        console.log('------ifEmailExist---', ifEmailExist)
        if (!ifEmailExist) {
            dataObj = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }

            console.log('-------dataObje-----', dataObj);
            const save = await Model.UserModel.create(dataObj);
            console.log('-----save----', save);
            res.send('Successfully signed up.');
        }
        else {
            console.log('-----ifEmail inside else block----', ifEmailExist);
            res.send('user with this email alredy exist please use different email')
        }
    }
}
