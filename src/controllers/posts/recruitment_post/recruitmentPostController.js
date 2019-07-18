import { mongo } from 'mongoose'
//Todo: Models
import { recruitmentPostModel } from '../../../models/recruitment_post/recruitmentPostModel';
import { recruitmentCommentModel } from '../../../models/recruitment_post/recruitmentCommentModel';
import { recruitmentAttendModel } from '../../../models/recruitment_post/recruitmentAttendModel';
//Todo: Utils
import { uploadImage } from '../../../utils/imageUtil';
import { asyncClient } from '../../../configs/redisDBConnect';
//Todo: Contains
import { ERROR } from '../../../utils/constains/mainContain';

//Todo: Query List Recruitment Post
export const getListRecruitmentPost = async (lastPostID ) => {
    let result;
    if (lastPostID) {
        let _lastPostID = mongo.ObjectId(lastPostID);
        result = await recruitmentPostModel
            .find({ _id: { $lt: _lastPostID } })
            .limit(parseInt(process.env.NUMBER_OF_RECRUITMENT_POST_FIRST_TIME_QUERY))
            .populate('userID', 'profileName avatar')
            .sort({ _id: -1 });
    }
    else {
        result = await recruitmentPostModel
            .find()
            .limit(parseInt(process.env.NUMBER_OF_RECRUITMENT_POST_FIRST_TIME_QUERY))
            .populate('userID', 'profileName avatar')
            .sort({ _id: -1 });
    }
    if (result) return result;
    throw new Error(ERROR)
}
//Todo: Create default post
export const createRecruitmentPost = async (recruitmentPostData, req) => {
    const { userID, profileName, avatar } = req.session.user;
    let { postImage } = recruitmentPostData;
    let postImageUri;
    if (postImage) {
        postImageUri = await uploadImage(postImage);
    }
    recruitmentPostData['userID'] = userID;
    recruitmentPostData['postImage'] = postImageUri;
    let newRecruitmentPost = new recruitmentPostModel(recruitmentPostData);
    let result = await newRecruitmentPost.save();
    if (result) {
        let newRecruitmentAttend = new recruitmentAttendModel({ postID: result.id });
        let result2 = await newRecruitmentAttend.save();
        if (result2) {
            result['userInfo'] = {
                userID,
                profileName,
                avatar
            };
            result['interactive'] = {
                liked: false,
                likes: 0,
                comments: 0
            }
            return result;
        }
        throw new Error(ERROR)
    }
    throw new Error(ERROR)
}
//Todo: GetInteractiveInfo
export const getInteractiveInfo = async (postID, req) => {
    let { userID } = req.session.user;
    let attendID = getAttendID(postID);
    let getCommentsAsyncFunc = recruitmentCommentModel.countDocuments({ postID });
    let getAttendsAsyncFunc = asyncClient.scardAsync(attendID);
    let getAttendedAsyncFunc = asyncClient.sismemberAsync(attendID, userID);

    let comments = await getCommentsAsyncFunc;
    let attends = await getAttendsAsyncFunc;
    let attended = await getAttendedAsyncFunc;
    return {
        attends: attends ? attends : 0,
        attended: attended == 1 ? true : false,
        comments: comments ? comments : 0
    };
}
//Todo: Like default post
export const attendRecruitmentPost = async ({ postID, action }, req) => {
    let { userID } = req.session.user;
    let attendID = getAttendID(postID);
    let status;
    let attended;
    if (action === 'ATTEND') {
        status = await asyncClient.saddAsync(attendID, userID);
        attended = true;
    }
    else {
        status = await asyncClient.sremAsync(attendID, userID);
        attended = false;
    }
    const attends = await asyncClient.scardAsync(attendID);
    return {
        postID,
        count: attends ? attends : 0,
        attended
    }
}
//Todo: Get list comment default post
export const getListCommentRecruitmentPost = async ({ postID, skipNumber = 0 }, req) => {
    let result = await recruitmentCommentModel
        .find({ postID })
        .skip(skipNumber)
        .limit(parseInt(process.env.NUMBER_OF_COMMENT_FIRST_TIME_QUERY))
        .populate('userID', 'profileName avatar')
        .sort({ _id: -1 });
    if (result) return result.reverse();
    throw new Error(ERROR)
}
//Todo: Comment default post 
export const commentRecruitmentPost = async (commentRecruitmentPostData, req) => {
    let { userID, profileName, avatar } = req.session.user;
    let { commentImage } = commentRecruitmentPostData;
    let commentImageUri = "null";
    if (commentImage && commentImage != "null") {
        commentImageUri = await uploadImage(commentImage);
    }
    commentRecruitmentPostData['userID'] = userID;
    commentRecruitmentPostData['commentImage'] = commentImageUri;
    let newRecruitmentComment = new recruitmentCommentModel(commentRecruitmentPostData);
    let result = await newRecruitmentComment.save();
    if (result) {
        result['userInfo'] = {
            userID,
            profileName,
            avatar
        };
        return result;
    }
    throw new Error(ERROR)
}
export const getAttendID = (postID) => {
    return `recruitment_attend:${postID}:attends`;
}