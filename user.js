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
        type: String
    },
    password: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

module.exports=mongoose.model('user',UserModel);