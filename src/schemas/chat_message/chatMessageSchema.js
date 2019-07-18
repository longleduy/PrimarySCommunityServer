import { gql } from 'apollo-server-express';
import { PubSub, withFilter } from 'graphql-subscriptions';
//Todo: Controllers
import {
    createChatMessage,
    getListChatMessage
} from '../../controllers/chat_message/chatMessageController';
import {
    getChatMessageNotificationByID
} from '../../controllers/notifications/notificationController';
//Todo: MiddleWares
import { authorizationMiddleWare } from '../../middlewares/authorizationMiddleware';
//Todo: Utils
import { convertPostTime } from '../../utils/dateTimeUtil';
import { getChatChanelID } from '../../utils/commonUtil';
//Todo: Contains
import {
    CREATE_CHAT_MESSAGE_SUB,
    CREATE_CHAT_MESSAGE_NOTIFICATION_SUB
} from '../../utils/constains/subsContain';

const pubsub = new PubSub();

export const typeDefs = gql`
    # Data
    input chatMessageData {
        from: String!
        to: String!
        messageContent: String
        messageImage: String
    }
    input chanelIDData{
        to: String!
        lastMessageID: String
    }
    input userChatSubData{
        userID: String!
    }
    # Type
    type ChatMessage{
        messageID: String!
        userID: String!
        from: String!
        to: String!
        messageContent: String
        messageImage: String
        chatTime: String!
    }
    type ChatNotificationSub{
        chatNotificationID: String!
        userID: String!
        from: UserInfo!
        user: UserInfo!
        role: String!
        notificationContent: String
        userNewNotification: String
        userReadNotification: String
        userReadedNotification: String
        createTime: String!
    }
    extend type Query {
        getListChatMessage(chanelIDData: chanelIDData): [ChatMessage]
    }
    extend type Mutation {
        createChatMessage(chatMessageData: chatMessageData):ChatMessage
    }
    extend type Subscription{
        createChatMessageSub(chanelIDData:chanelIDData):ChatMessage
        createChatMessageNotificationSub(userChatSubData: userChatSubData):ChatNotificationSub
    }
`;
export const resolvers = {
    Query: {
        getListChatMessage: async (obj, { chanelIDData }, context) => {
            let result = await authorizationMiddleWare(context, getListChatMessage, chanelIDData);
            if(result.notificationResult){
                createChatSubResult(result.notificationResult, context);
            }
            return result.listChatMessage;
        }
    },
    Mutation: {
        createChatMessage: async (obj, { chatMessageData }, context) => {
            let result = await authorizationMiddleWare(context, createChatMessage, chatMessageData);
            //pubsub.publish(CREATE_CHAT_MESSAGE_SUB, { createChatMessageSub: result });
            createChatSubResult(result.notificationResult, context);
            return result;
        }
    },
    Subscription: {
        createChatMessageSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(CREATE_CHAT_MESSAGE_SUB),
                ({ createChatMessageSub: { chatChanelID } }, { chanelIDData: { from, to } }) => {
                    return chatChanelID === getChatChanelID(from, to)
                }
            )
        },
        createChatMessageNotificationSub: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(CREATE_CHAT_MESSAGE_NOTIFICATION_SUB),
                ({ createChatMessageNotificationSub: { chatChanelID } }, { userChatSubData:{userID} }) => {
                    return chatChanelID.indexOf(userID) !== -1;
                }
            )
        }
    },
    ChatMessage: {
        chatTime: async ({ chatTime }) => {
            return convertPostTime(chatTime);
        },
        messageID: async ({ id }) => {
            return id;
        },
        userID: async (obj, _, { req }) => {
            return req.session.user.userID;
        }
    }
}
export const createChatSubResult = async (notificationResult, { req }) => {
    let { userID, profileName, avatar } = req.session.user;
    let result = await getChatMessageNotificationByID(notificationResult.id);
    let createTime = convertPostTime(result.createTime);
    let resultSub = {
        chatNotificationID: result.id,
        chatChanelID: result.chatChanelID,
        userID:result.from.id,
        from: {
           userID: result.from.id,
           profileName: result.from.profileName,
           avatar: result.from.avatar
        },
        user: {
            userID: result.user.id,
            profileName: result.user.profileName,
            avatar: result.user.avatar
        },
        role: 'CHAT',
        notificationContent: result.notificationContent,
        userNewNotification: result.userNewNotification,
        userReadNotification: result.userReadNotification,
        userReadedNotification: result.userReadedNotification,
        createTime
    }
    pubsub.publish(CREATE_CHAT_MESSAGE_NOTIFICATION_SUB, { createChatMessageNotificationSub: resultSub });
}
