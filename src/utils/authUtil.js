import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassWordAsync = async (password) => {
    let hashPassWord = await bcrypt.hash(password, 10);
    return hashPassWord;
}
export const comparePassWordAsync = async (passWord, passWordHashed) => {
    let status = await bcrypt.compare(passWord, passWordHashed);
    return status;
}
export const genJWT = (payload, secretKey, expireTime) => {
    return jwt.sign(payload, secretKey, { expiresIn: expireTime })
}
export const signInRespone = (isSuccess, message = null, jwt = null) => {
    return {
        isSuccess,
        message,
        jwt
    }
}
export const createVerifyEmailLink = (email) => {
    const urlEndPoint =new Buffer(email).toString('base64');
    const link = `http://${process.env.HOST_NAME_DEV}:${process.env.PORT}/graphql/?query={verifyEmail(secretKey: "${urlEndPoint}"){status}}`;
    return link;
}