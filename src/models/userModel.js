import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    profileName : {type: String, required:true},
    email: {type: String,unique:true},
    passWord: {type: String},
    gender: {type: String},
    dateOfBirth: { type: String },
    active: { type: Boolean, required: true },
    avatar: { type: String },
    createTime: {type: Date, default: Date.now},
    status: { type: String },
    socialKey: { type: String }
})
export const userModel = mongoose.model('user_infos',userSchema);