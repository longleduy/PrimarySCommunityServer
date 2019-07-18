import mongoose from 'mongoose';

const recruitmentCommentSchema = mongoose.Schema({
    postID: {type: String, required:true},
    commentContent: {type: String},
    commentImage: {type: String},
    createTime: {type: Date, default: Date.now},
    userID: {type: mongoose.Schema.Types.ObjectId, ref:'user_infos'},

})
export const recruitmentCommentModel = mongoose.model('recruitment_comments',recruitmentCommentSchema);