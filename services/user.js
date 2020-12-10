const Model = require('../model');
const md5 = require('md5');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types;
const responsemsg = require('../contants/response');

//login api
exports.login = login;
exports.changePassword = changePassword;
exports.signup = signup;
exports.getUserProfile = getUserProfile;
exports.editProfile = editProfile;


async function login(req, res) {
    // console.log('logging req----', req.body);
    const email = req.body.email;
    const password = md5(req.body.password);
    // console.log('--------psw--------',password);
    if (!email || !password) {
        res.send(responsemsg.parammissing);
    }
    else {
        const isUserExists = await Model.UserModel.findOne({ email: email });
        if (isUserExists == null) {
            res.send(responsemsg.userExist)
        } else {
            if (isUserExists.password != password) {
                res.send(responsemsg.wrongPassword);
            } else {
                res.send({message: responsemsg.sucessLogin, data: isUserExists});
            }
        }
    }
}

//signup api

async function signup(req, res) {
    console.log('logging req----', req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = md5(req.body.password);
    const addres = req.body.addres;
    const phoneNumber = req.body.phoneNumber;

    if (!email || !password || !firstName || !addres || !phoneNumber ) {
        res.send(responsemsg.parammissing);
    }
    else {
        const ifEmailExist = await Model.UserModel.findOne({ email: email });
        console.log('------ifEmailExist---', ifEmailExist)
        if (!ifEmailExist) {
            dataObj = {
                firstName: firstName,
                lastName: lastName,
                addres: addres,
                email: email,
                password: password,
                phoneNumber: phoneNumber
            }

            console.log('-------dataObje-----', dataObj);
            const save = await Model.UserModel.create(dataObj);
            console.log('-----save----', save);
            res.send(responsemsg.signUp);
        }
        else {
            console.log('-----ifEmail inside else block----', ifEmailExist);
            res.send(responsemsg.userExist)
        }
    }
}

//changePassword api

async function changePassword(req, res) {
    console.log('------logging request--', req.body);
    const id = req.body._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    console.log('--', id, oldPassword, newPassword);
    if (!id || !oldPassword || !newPassword || !confirmPassword) {
        res.send(responsemsg.parammissing);
    }
    else {
        const user = await Model.UserModel.findOne({ _id: id });
        if (user.password != md5(oldPassword)) {
            res.send("Old password is not correct");
        }
        else {
            if (user.password == md5(newPassword)) {
                res.send(responsemsg.samePassword);
            } else {
                if (confirmPassword != newPassword) {
                    res.send(responsemsg.unmatchPassword);
                }
                else {
                    const result = await Model.UserModel.findOneAndUpdate({ _id: id }, { password: md5(newPassword) }, { new: true });
                    res.send({ message: 'Password Updated Successfully', data: result });
                }
            }
        }
    }
}

//getting user profile

async function getUserProfile(req, res) {
    const id = req.body._id;
    const userData = await Model.UserModel.findOne({ _id: id });
    console.log('----------logging ----------', userData);
    res.send({ message: ' User Profile', data: userData });
}

//edit profile

async function editProfile(req, res) {
    const id = req.body._id;
    if (!id) {
        res.send(responsemsg.parammissing);
    }
    else {
        const updateObj = {};
        if(req.body.firstName){
            updateObj.firstName = req.body.firstName;
        }
        if(req.body.lastName){
            updateObj.lastName = req.body.lastName;
        }
        if(req.body.email){
            updateObj.email = req.body.email;
        }
        if(req.body.addres){
            updateObj.addres = req.body.addres;
        }
        if(req.body.phoneNumber){
            updateObj.phoneNumber = req.body.phoneNumber;
        }
        console.log('---updateObj----', updateObj);
        const updateUserDetails = await Model.UserModel.findByIdAndUpdate({_id : id}, updateObj, {new: true})
        res.send({message: responsemsg.update, data: updateUserDetails});
    }
}
