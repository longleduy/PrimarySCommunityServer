import mongoose from 'mongoose';

const defaultPostSchema = mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'user_infos'},
    postContent : {type: String, required:true},
    postImage: {type: String},
    postTag: {type: Array},
    isComment: {type: Boolean},
    isPublic: {type: Boolean},
    createTime: {type: Date, default: Date.now},
})
export const defaultPostModel = mongoose.model('default_posts',defaultPostSchema);