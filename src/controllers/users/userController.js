import { mongo } from 'mongoose'
import { userModel } from '../../models/userModel';
import { qrCodeModel } from '../../models/qrCodeModel';
//Todo: Utils
import { hashPassWordAsync, comparePassWordAsync, signInRespone, genJWT } from '../../utils/authUtil';
//Todo: Contains
import {
    SIGN_UP_ERROR,
    EMAIL_EXITS,
    SIGNIN_EMAIL_NOT_ACTIVE,
    SIGNIN_USER_INFO_INVALID,
    EMAIL_VERIFY_INVALID
} from '../../utils/constains/authContain';
import { ERROR } from '../../utils/constains/mainContain';

//Todo: Đăng ký
export const signUp = async (signUpdata) => {
    try {
        const passWord = await hashPassWordAsync(signUpdata.passWord);
        const userInfo = new userModel({
            profileName: `${signUpdata.firstName} ${signUpdata.lastName}`,
            email: signUpdata.email,
            passWord,
            gender: signUpdata.gender,
            dateOfBirth: signUpdata.dateOfBirth,
            active: false,
            avatar: null
        })
        const result = await userInfo.save();
        if (result) return { isSuccess: true };
        return { isSuccess: false, message: SIGN_UP_ERROR };
    } catch (error) {
        if (error.code === 11000) return { isSuccess: false, message: EMAIL_EXITS };
        return { isSuccess: false, message: SIGN_UP_ERROR };
    }

}
//Todo: Đăng nhập
export const signIn = async (signData, req) => {
    const { email, passWord } = signData;
    const result = await userModel.findOne({ email });
    if (result) {
        if (!result.active) return signInRespone(false, SIGNIN_EMAIL_NOT_ACTIVE);
        else {
            const verifyPasswordStatus = await comparePassWordAsync(passWord, result.passWord);
            if (!verifyPasswordStatus) return signInRespone(false, SIGNIN_USER_INFO_INVALID);
            else {
                const payload = {
                    userID: result._id,
                    avatar: result.avatar,
                    email: result.email,
                    profileName: result.profileName,
                    gender: result.gender,
                    dateOfBirth: result.dateOfBirth
                }
                req.session.user = payload;
                const jwt = genJWT(payload, process.env.SECRET_KEY, '1d');
                return signInRespone(true, null, jwt);
            }
        }

    }
    else return signInRespone(false, SIGNIN_USER_INFO_INVALID);
}
//Todo: Đăng xuất
export const signOut = async (req) => {
    await req.session.destroy();
    return { isSuccess: true }
}
//Todo: Tao lenh Sx 
export const taoLenhSx = async ({ maSx, qrCode }) => {
    const qrCodeInfo = new qrCodeModel({
        maSx,
        qrCode
    })
    const result = await qrCodeInfo.save();
    if (result) return { isSuccess: true };
    return { isSuccess: false, message: 'SERVER ERROR' };
}
export const filterQRCode = async(filterKey) => {
    const result = qrCodeModel.find({maSx:{$regex: filterKey,$options: 'i'}}).sort( { _id: -1 } ).limit(5);
    return result;
}
export const getQRCodeInfo = async(qrCodeID) => {
    let _id = mongo.ObjectId(qrCodeID);
    const result = qrCodeModel.findOne({_id});
    return result;
}
export const verifyEmail = async (emailEncoded) => {
    const email = new Buffer(emailEncoded, 'base64').toString('ascii');
    const data = await userModel.findOneAndUpdate({ email: email, active: false }, { $set: { active: true } });
    if (!data) throw new Error(EMAIL_VERIFY_INVALID);
    return { status: "Actived" }
}
export const getUserInfoByID = async (userID) => {
    let userInfo = await userModel.findOne({ _id: userID });
    if (userInfo) return userInfo;
    throw new Error(ERROR);
}