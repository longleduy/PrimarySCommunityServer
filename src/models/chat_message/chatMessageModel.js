import mongoose from 'mongoose';

const chatMessageSchema = mongoose.Schema({
    chatChanelID: { type: String, require: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    messageContent: { type: String },
    messageImage: { type: String, default: null },
    chatTime: { type: Date, default: Date.now },
})
export const chatMessageModel = mongoose.model('chat_messages', chatMessageSchema);