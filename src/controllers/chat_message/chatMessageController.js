//Todo: Models
import { chatMessageModel } from '../../models/chat_message/chatMessageModel';
//Todo: Contains
import { AUTHORIZATION_ERROR } from '../../utils/constains/authContain';
import { ERROR } from '../../utils/constains/mainContain';
//Todo: Utils
import { getChatChanelID } from '../../utils/commonUtil';
//Todo: Controllers
import {createChatMessageNotification,updateChatMessageNotification} from '../notifications/notificationController'

export const createChatMessage = async (chatMessageData, req) => {
    let { to, messageContent, messageImage } = chatMessageData;
    let { userID } = req.session.user;
    let chatChanelID = getChatChanelID(userID, to);
    chatMessageData['chatChanelID'] = chatChanelID;
    let newChatMessage = new chatMessageModel(chatMessageData);
    let result =await newChatMessage.save();
    if (result) {
        let notificationData = {
            user: to,
            from:userID,
            chatChanelID,
            notificationContent:messageContent,
            userNewNotification:to,
            userReadNotification:to,
            createTime: result.chatTime,

        };
        let notificationResult =  await createChatMessageNotification(notificationData);
        result["notificationResult"] = notificationResult;
        return result;
    }
    throw new Error(ERROR);
}

export const getListChatMessage = async ({to, lastMessageID = null }, req) => {
    let { userID } = req.session.user;
    //if (from !== userID) throw new Error(AUTHORIZATION_ERROR);
    let chatChanelID = getChatChanelID(userID, to);
    let result;
    if (lastMessageID) {
        result = await chatMessageModel
            .find({ chatChanelID,_id: { $lt: lastMessageID } })
            .limit(parseInt(process.env.NUMBER_OF_MESSAGE_CHAT_QUERY))
            .sort({ _id: -1 });
    }
    else {
        result = await chatMessageModel
            .find({ chatChanelID})
            .limit(parseInt(process.env.NUMBER_OF_MESSAGE_CHAT_QUERY))
            .sort({ _id: -1 });
    }
    if (result){
        let notificationResult = await updateChatMessageNotification(chatChanelID,req);
        let resultObj = {
            listChatMessage:result.reverse(),
            notificationResult
        }
        return resultObj;
    }
    throw new Error(ERROR)
}