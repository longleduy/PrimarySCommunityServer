import mongoose from 'mongoose';

const chatNotificationSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user_infos' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'user_infos' },
    role: { type: String, require: true },
    chatChanelID: { type: String },
    notificationContent: { type: String },
    userNewNotification: { type: String },
    userReadNotification: { type: String },
    userReadedNotification: {type: String, default: null},
    createTime: { type: Date, default: Date.now },

})
export const chatNotificationModel = mongoose.model('chat_notifications', chatNotificationSchema);