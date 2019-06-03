import { gql } from 'apollo-server-express';
import {
    signUp,
    signIn,
    signOut,
    verifyEmail
} from '../../controllers/users/userController';
import { createVerifyEmailLink } from '../../utils/authUtil'

import delay from 'delay';
export const typeDefs = gql`
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
    extend type Query {
        verifyEmail(secretKey: String!): VerifyEmailRespone
        createVerifyEmailLink(email: String!): createVerifyEmailLinkRespone
    }
    extend type Mutation {
        signIn(signInData: signInData): SignInRespone
        signUp(signUpData: signUpData): SignUpRespone
        signOut: DefaultRespone
    }
`;
export const resolvers = {
    Query: {
        verifyEmail: async (obj, { secretKey }, context) => {
            let result = await verifyEmail(secretKey);
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
        }

    }
}