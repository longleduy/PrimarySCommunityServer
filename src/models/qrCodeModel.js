import mongoose from 'mongoose';

const qrCodeSchema = mongoose.Schema({
    maSx : {type: String, required:true,unique:true},
    qrCode: {type: String, required:true},
    createTime: {type: Date, default: Date.now},
})
export const qrCodeModel = mongoose.model('qrcode_infos',qrCodeSchema);