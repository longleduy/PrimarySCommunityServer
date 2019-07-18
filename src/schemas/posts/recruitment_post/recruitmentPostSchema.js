import { gql } from 'apollo-server-express';
import { PubSub, withFilter } from 'graphql-subscriptions';
//Todo: Controllers
import {
    getListRecruitmentPost,
    createRecruitmentPost,
    commentRecruitmentPost,
    attendRecruitmentPost,
    getInteractiveInfo,
    getListCommentRecruitmentPost
} from '../../../controllers/posts/recruitment_post/recruitmentPostController';
//Todo: MiddleWares
import { authorizationMiddleWare } from '../../../middlewares/authorizationMiddleware';
//Todo: Utils
import { convertPostTime } from '../../../utils/dateTimeUtil';
//Todo: Contains
import {
    CREATE_RECRUIMENT_POST_SUB,
    ATTEND_RECRUIMENT_POST_SUB,
    COMMENT_RECRUIMENT_POST_SUB,
    COMMENT_RECRUIMENT_POST_COUNT_SUB
} from '../../../utils/constains/subsContain';

const pubsub = new PubSub();

export const typeDefs = gql`
    # Data
    input recruitmentPostData {
        postContent: String!
        postImage: String
        postTag: [String]
        role: [String]
        salary: String
        number: String
        company: String!
        address: String!
        emailAddress: String!
        phoneNumber: String
    }
    input commentRecruitmentPostData {
        postID: String!
        commentContent: String
        commentImage: String
    }
    input attendRecruitmentPostData {
        postID: String!
        action: String
    }
    input getListCommentRecruitmentPostData {
        postID: String!
        skipNumber: Int
    } 
    # Type
    type RecruitmentPost{
        userInfo: UserInfo!
        postID: String!
        postContent: String!
        postImage: String
        postTag: [String]!
        role: [String]
        salary: String
        number: String
        company: String!
        address: String!
        emailAddress: String!
        phoneNumber: String
        interactive2: Interactive2
        postStatus: String
        postCreateTime: String!
    }
    type RecruitmentPostComment{
        commentID: String!
        commentContent: String!
        commentImage: String
        commentCreateTime: String!
        userInfo: UserInfo!
    }
    type RecruitmentPostAttend{
        postID: String!
        count: Int
        attended: Boolean
    }
    type Interactive2{
        attends: Int
        attended: Boolean
        comments: Int
    }
    type commentRecruitmentPostCountSubRes{
        postID: String!
        comments: Int
    }
    extend type Query {
        getListRecruitmentPost(lastPostID: String): [RecruitmentPost]
        getListCommentRecruitmentPost(getListCommentRecruitmentPostData: getListCommentRecruitmentPostData):[RecruitmentPostComment]
    }
    extend type Mutation {
        createRecruitmentPost(recruitmentPostData: recruitmentPostData): RecruitmentPost
        commentRecruitmentPost(commentRecruitmentPostData:commentRecruitmentPostData):RecruitmentPostComment
        attendRecruitmentPost(attendRecruitmentPostData: attendRecruitmentPostData):RecruitmentPostAttend
    }
    extend type Subscription{
        createRecruitmentPostSub:RecruitmentPost
        commentRecruitmentPostSub(postID:String!):RecruitmentPostComment
        commentRecruitmentPostCountSub:commentRecruitmentPostCountSubRes
        attendRecruitmentPostSub:RecruitmentPostAttend
    }
`;
export const resolvers = {
    Query: {
        getListRecruitmentPost: async (obj, {lastPostID}, context) => {
            let result = await authorizationMiddleWare(context, getListRecruitmentPost,lastPostID);
            return result;
        },
        getListCommentRecruitmentPost: async (obj, { getListCommentRecruitmentPostData }, context) => {
            let result = await authorizationMiddleWare(context, getListCommentRecruitmentPost, getListCommentRecruitmentPostData);
            return result;
        }
    },
    Mutation: {
        createRecruitmentPost: async (obj, { recruitmentPostData }, context) => {
            let result = await authorizationMiddleWare(context, createRecruitmentPost, recruitmentPostData);
            pubsub.publish(CREATE_RECRUIMENT_POST_SUB, { createRecruitmentPostSub: result });
            return result;
        },
        commentRecruitmentPost: async (obj, { commentRecruitmentPostData }, context) => {
            let { postID } = commentRecruitmentPostData;
            let result = await authorizationMiddleWare(context, commentRecruitmentPost, commentRecruitmentPostData);
            pubsub.publish(COMMENT_RECRUIMENT_POST_COUNT_SUB, { commentRecruitmentPostCountSub: { postID } });
            pubsub.publish(COMMENT_RECRUIMENT_POST_SUB, { commentRecruitmentPostSub: result });
            return result;
        },
        attendRecruitmentPost: async (obj, { attendRecruitmentPostData }, context) => {
            let result = await authorizationMiddleWare(context, attendRecruitmentPost, attendRecruitmentPostData);
            pubsub.publish(ATTEND_RECRUIMENT_POST_SUB,{attendRecruitmentPostSub:result})
            return result;
        },
    },
    Subscription: {
        createRecruitmentPostSub: {
            subscribe: () => pubsub.asyncIterator(CREATE_RECRUIMENT_POST_SUB)
        },
        commentRecruitmentPostSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COMMENT_RECRUIMENT_POST_SUB),
                ({ commentRecruitmentPostSub: { postID } }, variables) => {
                    return postID === variables.postID
                }
            )
        },
        commentRecruitmentPostCountSub: {
            subscribe: () => pubsub.asyncIterator(COMMENT_RECRUIMENT_POST_COUNT_SUB)
        },
        attendRecruitmentPostSub: {
            subscribe: () => pubsub.asyncIterator(ATTEND_RECRUIMENT_POST_SUB)
        }
    },
    RecruitmentPost: {
        userInfo: async (obj) => {
            if (obj.userInfo) return obj.userInfo;
            return {
                userID: obj.userID.id,
                profileName: obj.userID.profileName,
                avatar: obj.userID.avatar,
            }
        },
        postCreateTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
        postID: async ({ id }) => {
            return id;
        },
        interactive2: async (obj, args, { req }) => {
            if (obj.interactive) return obj.interactive;
            let result = await getInteractiveInfo(obj.id, req);
            return result;
        }
    },
    RecruitmentPostComment: {
        userInfo: async (obj) => {
            if (obj.userInfo) return obj.userInfo;
            return {
                userID: obj.userID.id,
                profileName: obj.userID.profileName,
                avatar: obj.userID.avatar,
            }
        },
        commentCreateTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
        commentID: async ({ id }) => {
            return id;
        },
    }
}
