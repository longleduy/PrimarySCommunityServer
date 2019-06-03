import { defaultPostModel } from '../../../models/defaultPostModel';
//Todo: Utils
import { uploadImage } from '../../../utils/imageUtil';
import { asyncClient } from '../../../configs/redisDBConnect';
import { convertPostTime } from '../../../utils/dateTimeUtil'
//Todo: Contains
import { ERROR } from '../../../utils/constains/mainContain';

//Todo: Create default post
export const createDefaultPost = async (defaultPostData, req) => {
    const { userID, profileName, avatar } = req.session.user;
    let postImageUri;
    if (defaultPostData.postImage) {
        postImageUri = await uploadImage(defaultPostData.postImage);
    }
    //let userID = '5ccfa1bbb8ff872ef0a2713c';
    defaultPostData['userID'] = userID;
    defaultPostData['postImage'] = postImageUri;
    let newDefaultPost = new defaultPostModel(defaultPostData);
    let result = await newDefaultPost.save();
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
//Todo: Get list of default post
export const getListDefaultPost = async (args, req, res) => {
    let result = await defaultPostModel
        .find()
        .limit(parseInt(process.env.NUMBER_OF_POST_FIRST_TIME_QUERY))
        .populate('userID', 'profileName avatar')
        .sort({ _id: -1 });
    if (result) return result;
    throw new Error(ERROR)
}
//Todo: GetInteractiveInfo
export const getInteractiveInfo = async (postID, req) => {
    try {

        let { userID } = req.session.user;
        let likeID = getLikeID(postID);
        let commentID = getListCommentID(postID);
        let countLikeAsyncFunc = asyncClient.scardAsync(likeID);
        let countCommentAsyncFunc = asyncClient.scardAsync(commentID);
        let likedAsyncFunc = asyncClient.sismemberAsync(likeID, userID);

        let likes = await countLikeAsyncFunc;
        let liked = await likedAsyncFunc;
        let comments = await countCommentAsyncFunc;

        return {
            likes: likes ? likes : 0,
            liked: liked == 1 ? true : false,
            comments: comments ? comments : 0
        };

    } catch (error) {
        console.log(error);
        throw error
    }
}
//Todo: Like default post
export const likeDefaultPost = async ({ postID, action }, req) => {
    let { userID } = req.session.user;
    let likeID = getLikeID(postID);
    let status;
    let liked;
    if (action === 'LIKE') {
        status = await asyncClient.saddAsync(likeID, userID);
        liked = true;
    }
    else {
        status = await asyncClient.sremAsync(likeID, userID);
        liked = false;
    }
    const likeAsyncFunc = asyncClient.scardAsync(likeID);
    const likes = await likeAsyncFunc;
    return {
        postID,
        count: likes ? likes : 0,
        liked
    }
}
//Todo: Get list comment default post
export const getListCommentDefaultPost = async ({ postID, skipNumber = 0 }, req) => {
    let limitNumber = process.env.NUMBER_OF_COMMENT_FIRST_TIME_QUERY;
    let commentListID = getListCommentID(postID);
    let commentIDKey = getCommentID(postID);
    let listCommentID = await asyncClient.sortAsync(commentListID, "alpha", "desc", "limit", skipNumber, limitNumber);
    let multi = asyncClient.multi();
    for (let commentID of listCommentID) {
        multi.hgetall(`${commentIDKey}:${commentID}`)
    }
    let result = await multi.execAsync();

    if(result) return result.reverse();
    throw new Error(ERROR);
    // const result = [];
    // for (let commentID of listCommentID) {
    //     const comment = await asyncClient.hgetallAsync(`${commentIDKey}:${commentID}`);
    //     if (comment) {
    //         result.unshift(comment);
    //     }
    // }
    // return result;
}
//Todo: Comment default post 
export const commentDefaultPost = async ({ postID, commentContent, commentImage }, req) => {
    let { userID, profileName, avatar } = req.session.user;
    let commentImageUri = "null";
    if (commentImage && commentImage != "null") {
        commentImageUri = await uploadImage(commentImage);
    }
    let commentID = getCommentID(postID);
    let commentListID = getListCommentID(postID);
    let commentDate = (new Date()).getTime();
    let multi = asyncClient
        .multi()
        .sadd(commentListID, `${commentDate}`)
        .hset(`${commentID}:${commentDate}`, "userID", userID,"commentID",commentDate, "commentContent", commentContent, "commentImage", commentImageUri, "commentDate", commentDate);
        let result = await multi.execAsync();
        if (result[0] === 1 && result[1] === 5) return {
            postID,
            commentID:commentDate,
            commentContent,
            commentDate,
            commentImage:commentImageUri,
            userInfo: {
                userID,
                profileName,
                avatar
            }
        }
        throw new Error(ERROR);

}
export const getLikeID = (postID) => {
    return `default_post:${postID}:likes`;
}
export const getCommentID = (postID) => {
    return `default_post:${postID}:comments`;
}
export const getListCommentID = (postID) => {
    return `default_post:${postID}:comment_list`;
}
export const getCommentCountID = (postID, comments) => {
    return `default_post:${postID}:comments:${comments}`;
}