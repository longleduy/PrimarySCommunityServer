import { mongo } from 'mongoose';

export const getChatChanelID = (from, to) => {
    const _idForm = mongo.ObjectId(from);
    const _idTo = mongo.ObjectId(to);
    let chanelID = `${from}-${to}`
    if (_idForm <= _idTo) {
        chanelID = `${to}-${from}`
    }
    return chanelID;
}