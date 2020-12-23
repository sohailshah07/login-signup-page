const mongoose =require('mongoose');
const Schema = mongoose.Schema;

var UserModel=new Schema({
    firstName:{
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: String,
        default: null
    },
    addres: {
        type: String,
        default: null
    },
    authToken: {
        type: String,
        default: null
    },
    photo: {
        type: String,
        default: null
    }
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

module.exports=mongoose.model('user',UserModel);