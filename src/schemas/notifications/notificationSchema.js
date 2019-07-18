import { gql } from 'apollo-server-express';
import { PubSub, withFilter } from 'graphql-subscriptions';
//Todo: Controllers
import {
    getChatMessageNotification,
    getChatMessageNotificationByID
} from '../../controllers/notifications/notificationController';
//Todo: MiddleWares
import { authorizationMiddleWare } from '../../middlewares/authorizationMiddleware';
//Todo: Utils
 import { convertPostTime } from '../../utils/dateTimeUtil';
// import { getChatChanelID } from '../../utils/commonUtil';
//Todo: Contains
// import {
//     CREATE_CHAT_MESSAGE_SUB
// } from '../../utils/constains/subsContain';

const pubsub = new PubSub();

export const typeDefs = gql`
    # Data
    input getChatMessageNotificationData {
        lastNotificationID: String
    }
    # Type
    type ChatNotification{
        chatNotificationID: String!
        userID: String!
        from: UserInfo!
        role: String!
        notificationContent: String
        userNewNotification: String
        userReadNotification: String
        userReadedNotification: String
        createTime: String!
    }
    extend type Query {
        getChatMessageNotification(getChatMessageNotificationData: getChatMessageNotificationData): [ChatNotification]
    }
    # extend type Mutation {
    #     createChatMessage(chatMessageData: chatMessageData):ChatMessage
    # }
    # extend type Subscription{
    #     createChatMessageSub(chanelIDData:chanelIDData):ChatMessage
    # }
`;
export const resolvers = {
    Query: {
        getChatMessageNotification: async (obj, {lastNotificationID}, context) => {
            let result = await authorizationMiddleWare(context, getChatMessageNotification,lastNotificationID);
            return result;
        }
    },
    ChatNotification: {
        from:async ({from,user},_,{req}) => {
            let {userID} = req.session.user;
            if(user && from && userID === from.id){
                return {
                    userID: user.id,
                    profileName: user.profileName,
                    avatar: user.avatar
                }
            }
            else if(user && from && userID === user.id){
                return {
                    userID: from.id,
                    profileName: from.profileName,
                    avatar: from.avatar
                }
            }
            return {userID:'?',profileName: "Anonymous",avatar: null}
        },
        createTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
        chatNotificationID: async ({id}) => {
            return id;
        },
        userID : async (obj,_,{req}) => {
            return req.session.user.userID
        }
    }
}
