import { gql } from 'apollo-server-express';
import { PubSub, withFilter } from 'graphql-subscriptions';
//Todo: Controllers
import {
    createDefaultPost,
    getListDefaultPost,
    getInteractiveInfo,
    likeDefaultPost,
    commentDefaultPost,
    getListCommentDefaultPost
} from '../../../controllers/posts/default_posts/defaultPostController';
import { getUserInfoByID } from '../../../controllers/users/userController';
//Todo: MiddleWares
import { authorizationMiddleWare } from '../../../middlewares/authorizationMiddleware';
//Todo: Utils
import { convertPostTime } from '../../../utils/dateTimeUtil';
//Todo: Contains
import {
    CREATE_DEFAULT_POST_SUB,
    LIKE_DEFAULT_POST_SUB,
    COMMENT_DEFAULT_POST_SUB,
    COMMENT_DEFAULT_POST_COUNT_SUB
} from '../../../utils/constains/subsContain';

const pubsub = new PubSub();

export const typeDefs = gql`
    # Data
    input defaultPostData {
        postContent: String!
        postImage: String
        postTag: [String]!
        isComment: Boolean
        isPublic: Boolean
    }
    input likeDefaultPostData {
        postID: String!
        action: String
    }
    input getListCommentDefaultPostData {
        postID: String!
        skipNumber: Int
    }
    input commentDefaultPostData {
        postID: String!
        commentContent: String!
        commentImage: String
    }
    # Type
    type DefaultPost{
        userInfo: UserInfo!
        isAuthor: Boolean
        postID: String!
        postContent: String!
        postImage: String
        postTag: [String]!
        isComment: Boolean
        isPublic: Boolean
        postCreateTime: String!
        interactive: Interactive
    }
    type DefaultPostComment{
        commentID: String!
        commentContent: String!
        commentImage: String
        commentCreateTime: String!
        userInfo: UserInfo!
    }
    type UserInfo{
        userID: String!
        profileName: String!
        avatar: String
    }
    type Interactive{
        liked: Boolean
        likes: Int
        comments: Int
    }
    # Respone
    type CreateDefaultPostSubRespone{
        userInfo: UserInfo!
        isAuthor: Boolean
        postID: String!
        postContent: String!
        postImage: String
        postTag: [String]!
        isComment: Boolean
        isPublic: Boolean
        postCreateTime: String!
        interactive: Interactive
    }
    type LikeDefaultPostSubRespone{
        postID: String!
        count: Int
        liked: Boolean
    }
    type CommentDefaultPostCountSubRespone{
        postID: String!
        comments: Int
    }
    extend type Query {
        getListDefaultPost: [DefaultPost]
        getListCommentDefaultPost(getListCommentDefaultPostData: getListCommentDefaultPostData):[DefaultPostComment]
    }
    extend type Mutation {
        createDefaultPost(defaultPostData: defaultPostData): CreateDefaultPostSubRespone
        likeDefaultPost(likeDefaultPostData: likeDefaultPostData):LikeDefaultPostSubRespone
        commentDefaultPost(commentDefaultPostData:commentDefaultPostData):DefaultPostComment
    }
    extend type Subscription{
        createDefaultPostSub:CreateDefaultPostSubRespone
        likeDefaultPostSub:LikeDefaultPostSubRespone
        commentDefaultPostSub(postID:String!): DefaultPostComment
        commentDefaultPostCountSub:CommentDefaultPostCountSubRespone
    }
`;
export const resolvers = {
    Query: {
        getListDefaultPost: async (obj, args, context) => {
            let result = await authorizationMiddleWare(context, getListDefaultPost);
            return result;
        },
        getListCommentDefaultPost: async (obj, { getListCommentDefaultPostData }, context) => {
            let result = await authorizationMiddleWare(context, getListCommentDefaultPost, getListCommentDefaultPostData);
            return result;
        }
    },
    Mutation: {
        createDefaultPost: async (obj, { defaultPostData }, context) => {
            let result = await authorizationMiddleWare(context, createDefaultPost, defaultPostData);
            pubsub.publish(CREATE_DEFAULT_POST_SUB, { createDefaultPostSub: result });
            return result;
        },
        likeDefaultPost: async (obj, { likeDefaultPostData }, context) => {
            let result = await authorizationMiddleWare(context, likeDefaultPost, likeDefaultPostData);
            pubsub.publish(LIKE_DEFAULT_POST_SUB, { likeDefaultPostSub: result });
            return result;
        },
        commentDefaultPost: async (obj, { commentDefaultPostData }, context) => {
            let { postID, comments } = commentDefaultPostData;
            let result = await authorizationMiddleWare(context, commentDefaultPost, commentDefaultPostData);
            pubsub.publish(COMMENT_DEFAULT_POST_COUNT_SUB, { commentDefaultPostCountSub: { postID, comments: comments + 1 } });
            pubsub.publish(COMMENT_DEFAULT_POST_SUB, { commentDefaultPostSub: result });
            return result;
        }
    },
    Subscription: {
        createDefaultPostSub: {
            subscribe: () => pubsub.asyncIterator(CREATE_DEFAULT_POST_SUB)
        },
        likeDefaultPostSub: {
            subscribe: () => pubsub.asyncIterator(LIKE_DEFAULT_POST_SUB)
        },
        commentDefaultPostCountSub: {
            subscribe: () => pubsub.asyncIterator(COMMENT_DEFAULT_POST_COUNT_SUB)
        },
        commentDefaultPostSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COMMENT_DEFAULT_POST_SUB),
                ({ commentDefaultPostSub: { postID } }, variables) => {
                    return postID === variables.postID
                }
            )
        }
    },
    DefaultPost: {
        userInfo: async ({ userID: { id, profileName, avatar } }) => {
            return {
                userID: id,
                profileName,
                avatar
            }
        },
        postCreateTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
        postID: async ({ id }) => {
            return id;
        },
        interactive: async ({ id }, args, { req }) => {
            let result = await getInteractiveInfo(id, req);
            return result;
        }
    },
    CreateDefaultPostSubRespone: {
        userInfo: async ({ userInfo }) => {
            return userInfo
        },
        postCreateTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
        postID: async ({ id }) => {
            return id;
        },
        interactive: async () => {
            return {
                liked: false,
                likes: 0,
                comments: 0
            }
        }
    },
    DefaultPostComment: {
        userInfo: async ({ userInfo,userID }) => {
            if(userInfo) return userInfo;
            let result = await getUserInfoByID(userID);
            return {
                userID,
                profileName: result.profileName,
                avatar: result.avatar
            }
        },
        commentCreateTime: async ({ commentDate }) => {
            let date = new Date(parseInt(commentDate));
            return convertPostTime(date);
        }

    }
}