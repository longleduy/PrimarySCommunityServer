import { gql } from 'apollo-server-express';
import {
    signUp,
    signIn,
    signOut,
    verifyEmail,
    taoLenhSx,
    filterQRCode,
    getQRCodeInfo
} from '../../controllers/users/userController';
import { createVerifyEmailLink } from '../../utils/authUtil';
//Todo: Utils
import { convertPostTime } from '../../utils/dateTimeUtil';

import delay from 'delay';
export const typeDefs = gql`
    input lenhSxData {
        maSx: String!
        qrCode: String!
    }
    input signInData {
        email: String!
        passWord: String!
    }
    input signUpData {
        firstName: String!,
        lastName: String!
        email: String!
        passWord: String!,
        gender: String!,
        dateOfBirth: String!
    }
    type SignInRespone{
        isSuccess: Boolean!
        message: String
        jwt: String
    }
    type SignUpRespone{
        isSuccess: Boolean!
        message: String
    }
    type DefaultRespone{
        isSuccess: Boolean!
        message: String
    }
    type createVerifyEmailLinkRespone{
        link: String!
    }
    type VerifyEmailRespone{
        status: String!
    }
    type QRCodeInfo{
        QRCOdeID: String!
        maSx: String!
        qrCode: String!
        createTime: String!
    }
    extend type Query {
        verifyEmail(secretKey: String!): VerifyEmailRespone
        createVerifyEmailLink(email: String!): createVerifyEmailLinkRespone
        filterQRCode(filterKey: String): [QRCodeInfo]
        getQRCodeInfo(qrCodeID: String):QRCodeInfo
    }
    extend type Mutation {
        signIn(signInData: signInData): SignInRespone
        signUp(signUpData: signUpData): SignUpRespone
        signOut: DefaultRespone
        taoLenhSx(lenhSxData: lenhSxData): DefaultRespone
    }
`;
export const resolvers = {
    Query: {
        verifyEmail: async (obj, { secretKey }, context) => {
            let result = await verifyEmail(secretKey);
            return result
        },
        filterQRCode: async (obj, { filterKey }, context) => {
            let result = await filterQRCode(filterKey);
            return result
        },
        getQRCodeInfo: async (obj, { qrCodeID }, context) => {
            let result = await getQRCodeInfo(qrCodeID);
            return result
        },
    },
    Mutation: {
        signIn: async (obj, { signInData }, { req }) => {
            let result = await signIn(signInData, req);
            return result;
        },
        signUp: async (obj, { signUpData }) => {
            let result = await signUp(signUpData);
            return result;
        },
        signOut: async (obj, args, { req }) => {
            let result = await signOut(req);
            return result;
        },
        taoLenhSx: async (obj, {lenhSxData}, { req }) => {
            let result = await taoLenhSx(lenhSxData,req);
            return result;
        },
    }, 
    QRCodeInfo:{
        QRCOdeID: async ({ id }) => {
            return id;
        },
        createTime: async ({ createTime }) => {
            return convertPostTime(createTime);
        },
    }
}