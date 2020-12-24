const Model = require('../model');
const md5 = require('md5');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types;
const response = require('../contants/response');
const { get } = require('http');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { model } = require('../model/User');
const verifyToken = require('../verifyToken');
const path = require('path');
//login api
exports.login = login;
exports.changePassword = changePassword;
exports.signup = signup;
exports.getUserProfile = getUserProfile;
exports.editProfile = editProfile;

async function login(req, res) {
    const email = req.body.email;
    const password = md5(req.body.password);
    if (!email || !password) {
        res.send(response.parammissing);
    }
    else {
        const isUserExists = await Model.UserModel.findOne({ email: email });
        if (isUserExists == null) {
            res.send(response.userExist)
        } else {
            if (isUserExists.password != password) {
                res.send(response.wrongPassword);
            } else {
                let newToken = jwt.sign({ id: isUserExists._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                const saveToken = await Model.UserModel.findOneAndUpdate({ _id: isUserExists._id }, { authToken: newToken }, { new: true });
                res.send({ message: response.sucessLogin, data: saveToken });
            }
        }
    }
}
async function signup(req, res) {
    const firstName = req.body.firstName;
    // const photo = `${req.file.fieldname}_${path.extname(file.originalname)}`;
    const photo = `${req.file.fieldname}_${Date.now()}${path.extname(req.file.originalname)}`;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = md5(req.body.password);
    const addres = req.body.addres;
    const phoneNumber = req.body.phoneNumber;
    console.log('----photo---', photo);

    if (!email || !password || !firstName || !addres || !phoneNumber) {
        res.send(response.parammissing);
    }
    else {
        const ifEmailExist = await Model.UserModel.findOne({ email: email });
        if (!ifEmailExist) {
            dataObj = {
                firstName: firstName,
                lastName: lastName,
                addres: addres,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
                photo: photo
            }

            const save = await Model.UserModel.create(dataObj);
            res.send(response.signUp);
        }
        else {
            res.send(response.userExist)
        }
    }
}
async function changePassword(req, res) {
    const id = req.body._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    if (!id || !oldPassword || !newPassword || !confirmPassword) {
        res.send(response.parammissing);
    }
    else {
        const user = await Model.UserModel.findOne({ _id: id });
        if (user.password != md5(oldPassword)) {
            res.send("Old password is not correct");
        }
        else {
            if (user.password == md5(newPassword)) {
                res.send(response.samePassword);
            } else {
                if (confirmPassword != newPassword) {
                    res.send(response.unmatchPassword);
                }
                else {
                    const result = await Model.UserModel.findOneAndUpdate({ _id: id }, { password: md5(newPassword) }, { new: true });
                    res.send({ message: 'Password Updated Successfully', data: result });
                }
            }
        }
    }
}
async function getUserProfile(req, res) {
    const user = req.decodedData;
    let userData = await Model.UserModel.findOne({ _id: user.id }).lean();
  
    res.send({ message: ' User Profile', data: userData});

}
async function editProfile(req, res) {
    const id = req.body._id;
    if (!id) {
        res.send(response.parammissing);
    }
    else {
        const updateObj = {};
        if (req.body.firstName) {
            updateObj.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            updateObj.lastName = req.body.lastName;
        }
        if (req.body.email) {
            updateObj.email = req.body.email;
        }
        if (req.body.addres) {
            updateObj.addres = req.body.addres;
        }
        if (req.body.phoneNumber) {
            updateObj.phoneNumber = req.body.phoneNumber;
        }
        const updateUserDetails = await Model.UserModel.findByIdAndUpdate({ _id: id }, updateObj, { new: true })
        res.send({ message: response.update, data: updateUserDetails });
    }
}



