import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http';
import {
    defaultPost,
    defaultPostData,
    commentDefaultPostData,
    defaultPostComment,
    getListCommentDefaultPostData
} from './dataTest';
import { signInData, signInRespone} from '../../users/dataTest'
const expect = chai.expect;
chai.use(chaiHttp);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var Cookies;
export const defaultPostTest = () => {
    return describe('Default post Automation Test', () => {
        it('sign in success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`).send({
                        'query': `mutation{signIn(signInData:${signInData})${signInRespone}}`
                    })
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
            } catch (error) {
                throw error
            }
    
        })
        // it('create default post success', async () => {
        //     try {
        //         const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
        //             .post(`/${process.env.GRAPHQL_ENDPOINT}`)
        //             .send({
        //                 'query':
        //                     `mutation{
        //                         createDefaultPost(
        //                             defaultPostData:${defaultPostData}
        //                         )
        //                         ${defaultPost}
        //                         }`
        //             })
        //         expect(res.body.data.createDefaultPost).to.be.an('object');
        //         expect(res.body.data.createDefaultPost.userInfo).to.be.an('object');
        //         expect(res.body.data.createDefaultPost.postTag).to.be.a('array');
        //         expect(res.body.data.createDefaultPost.postID).to.be.not.null;
        //         expect(res.body.data.createDefaultPost.postContent).to.be.not.null;
        //         expect(res.body.data.createDefaultPost.postContent).to.be.a('string');
        //         expect(res.body.data.createDefaultPost.userInfo.userID).to.be.not.null;
        //         expect(res.body.data.createDefaultPost.userInfo.profileName).to.be.not.null;
        //     } catch (error) {
        //         throw error
        //     }

        // });
        it('get list default post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query': `{
                            getListDefaultPost
                                ${defaultPost}
                            }`
                    })
                expect(res.body.data.getListDefaultPost).to.be.a('array');
                (res.body.data.getListDefaultPost).forEach((item, idx) => {
                    expect(item, `Index: ${idx} error`).to.have.all.keys('userInfo', 'isAuthor', 'postID', 'postContent', 'postImage', 'postTag', 'isComment', 'isPublic', 'postCreateTime','interactive');
                    expect(item.userInfo, `Index: ${idx} error`).to.be.an('object');
                    expect(item.userInfo, `Index: ${idx} error`).to.have.all.keys('userID', 'profileName', 'avatar');
                    expect(item.postID, `Index: ${idx} error`).to.be.not.null;
                    expect(item.postContent, `Index: ${idx} error`).to.be.not.null;
                    expect((item.postTag).length, `Index: ${idx} error`).to.be.at.least(1);
                    expect(item.interactive, `Index: ${idx} error`).to.be.an('object');
                })
            } catch (error) {
                throw error
            }

        });
        it('comment default post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query':
                            `mutation{
                            commentDefaultPost(
                                commentDefaultPostData:${commentDefaultPostData}
                            )
                            ${defaultPostComment}
                            }`
                    })
                let { commentDefaultPost } = res.body.data;
                expect(commentDefaultPost).to.be.an('object');
                expect(commentDefaultPost).to.have.all.keys('commentID', 'commentContent', 'commentImage', 'commentCreateTime', 'userInfo');
                expect(commentDefaultPost.userInfo).to.be.an('object');
                expect(commentDefaultPost.userInfo).to.have.all.keys('userID', 'profileName', 'avatar');
                expect(commentDefaultPost.commentID).to.be.not.null;
                expect(commentDefaultPost.commentContent).to.be.not.null;
                expect(commentDefaultPost.commentCreateTime).to.be.not.null;
            } catch (error) {
                throw error
            }

        });
        it('get list comment default post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query': `{
                            getListCommentDefaultPost(
                                getListCommentDefaultPostData:${getListCommentDefaultPostData}
                            )
                                ${defaultPostComment}
                            }`
                    })
                let { getListCommentDefaultPost } = res.body.data;
                expect(getListCommentDefaultPost).to.be.a('array');
                expect(getListCommentDefaultPost).to.have.lengthOf(5);
                (getListCommentDefaultPost).forEach((item, idx) => {
                    expect(item).to.have.all.keys('commentID', 'commentContent', 'commentImage', 'commentCreateTime', 'userInfo');
                    expect(item.userInfo).to.be.an('object');
                    expect(item.userInfo).to.have.all.keys('userID', 'profileName', 'avatar');
                    expect(item.commentID).to.be.not.null;
                    expect(item.commentContent).to.be.not.null;
                    expect(item.commentCreateTime).to.be.not.null;
                })
            } catch (error) {
                throw error
            }

        });
    })
}
