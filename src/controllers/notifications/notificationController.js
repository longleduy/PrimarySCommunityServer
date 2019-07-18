import { chatNotificationModel } from '../../models/notitfications/chatNotificationModel';

export const createChatMessageNotification = async ({ user,
    from,
    chatChanelID,
    role = 'CHAT',
    notificationContent,
    createTime,
    userNewNotification,
    userReadNotification }) => {
    let result = await chatNotificationModel.findOneAndUpdate(
        {
            chatChanelID,
            role
        },
        {
            user,
            from,
            notificationContent,
            createTime,
            userNewNotification,
            userReadNotification
        },
        { upsert: true, new: true }
    );
    return result;
}
export const getChatMessageNotification = async (lastNotificationID = null, req) => {
    let { userID } = req.session.user;
    let result;
    if (lastNotificationID) {
        result = await chatNotificationModel.
            find({ _id: { $lt: lastNotificationID }, chatChanelID: { $regex: userID, $options: 'i' } }).
            limit(parseInt(process.env.NUMBER_OF_NOTIFICATION_MORE_QUERY)).
            populate('from', 'profileName avatar').
            populate('user', 'profileName avatar').
            sort({ createTime: -1, _id: -1 });
    }
    else {
        result = await chatNotificationModel.
            find({ chatChanelID: { $regex: userID, $options: 'i' } }).
            limit(parseInt(process.env.NUMBER_OF_NOTIFICATION_QUERY)).
            populate('from', 'profileName avatar').
            populate('user', 'profileName avatar').
            sort({ createTime: -1, _id: -1 });
    }
    if (result) return result;
    throw new Error(ERROR);

}
export const getChatMessageNotificationByID = async (chatNotificationID) => {
    let result = await chatNotificationModel.
        findOne({ _id: chatNotificationID }).
        populate('from', 'profileName avatar').
        populate('user', 'profileName avatar');
    if (result) return result;
    throw new Error(ERROR);

}
export const updateChatMessageNotification = async (chatChanelID, req) => {
    let { userID } = req.session.user;
    let result = await chatNotificationModel.findOneAndUpdate({ chatChanelID, userReadNotification: userID }, { userReadNotification: null,userReadedNotification:userID },{new: true});
    return result;
}