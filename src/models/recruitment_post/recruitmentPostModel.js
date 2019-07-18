import mongoose from 'mongoose';

const recruitmentPostSchema = mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'user_infos'},
    postContent : {type: String, required:true},
    postImage: {type: String},
    postTag: {type: Array},
    role: {type: Array},
    salary: {type: String},
    number: {type: String},
    company: {type: String, required:true},
    address: {type: String, required:true},
    emailAddress: {type: String, required:true},
    phoneNumber: {type: String},
    postStatus: {type: String, default: "Y"},
    createTime: {type: Date, default: Date.now},

})
export const recruitmentPostModel = mongoose.model('recruitment_posts',recruitmentPostSchema);