import mongoose from 'mongoose';

const recruitmentAttendSchema = mongoose.Schema({
    postID: { type: String, required: true },
    attends: { type: Number, default: 0 },
    attendUserID: { type: Array, default: [] }

})
export const recruitmentAttendModel = mongoose.model('recruitment_attends',recruitmentAttendSchema);