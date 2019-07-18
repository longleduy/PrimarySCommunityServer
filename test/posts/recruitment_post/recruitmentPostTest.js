import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http';
import {
    recruitmentPost,
    recruitmentPostData,
    commentRecruitmentPostData,
    recruitmentPostComment,
    attendRecruitmentPostData,
    recruitmentPostAttend
} from './dataTest';
import { signInData, signInRespone } from '../../users/dataTest'
const expect = chai.expect;
chai.use(chaiHttp);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var Cookies;
export const recruitmentPostPostTest = () => {
    return describe('Recruitment post Automation Test', () => {
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
        it('create recruitment post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query':
                            `mutation{
                                createRecruitmentPost(
                                    recruitmentPostData:${recruitmentPostData}
                                )
                                ${recruitmentPost}
                                }`
                    })
                expect(res.body.data.createRecruitmentPost).to.be.an('object');
                expect(res.body.data.createRecruitmentPost.postID).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.postContent).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.postTag).to.be.a('array');
                expect(res.body.data.createRecruitmentPost.postTag.length).to.be.at.least(1);
                expect(res.body.data.createRecruitmentPost.role).to.be.a('array');
                expect(res.body.data.createRecruitmentPost.role.length).to.be.at.least(1);
                expect(res.body.data.createRecruitmentPost.salary).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.number).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.company).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.address).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.emailAddress).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.userInfo).to.be.an('object');
                expect(res.body.data.createRecruitmentPost.userInfo.userID).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.userInfo.profileName).to.be.not.null;
                expect(res.body.data.createRecruitmentPost.interactive).to.be.an('object');
                expect(res.body.data.createRecruitmentPost).to.have.all.keys('postID',
                    'postContent',
                    'postImage',
                    'postTag',
                    'role',
                    'salary',
                    'number',
                    'company',
                    'address',
                    'emailAddress',
                    'phoneNumber',
                    'interactive',
                    'postCreateTime',
                    'userInfo');
                expect(res.body.data.createRecruitmentPost.interactive).to.have.all.keys('attended',
                    'attends',
                    'comments');
                expect(res.body.data.createRecruitmentPost.userInfo).to.have.all.keys('userID',
                    'profileName',
                    'avatar');
            } catch (error) {
                throw error
            }
        });
        it('get list recruitment post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query': `{
                            getListRecruitmentPost
                                ${recruitmentPost}
                            }`
                    })
                expect(res.body.data.getListRecruitmentPost).to.be.a('array');
                (res.body.data.getListRecruitmentPost).forEach((item, idx) => {
                    expect(item.postID, `Index: ${idx} error`).to.be.not.null;
                    expect(item.postContent, `Index: ${idx} error`).to.be.not.null;
                    expect(item.postTag, `Index: ${idx} error`).to.be.a('array');
                    expect(item.postTag.length, `Index: ${idx} error`).to.be.at.least(1);
                    expect(item.role, `Index: ${idx} error`).to.be.a('array');
                    expect(item.role.length, `Index: ${idx} error`).to.be.at.least(1);
                    expect(item.salary, `Index: ${idx} error`).to.be.not.null;
                    expect(item.number, `Index: ${idx} error`).to.be.not.null;
                    expect(item.company, `Index: ${idx} error`).to.be.not.null;
                    expect(item.address, `Index: ${idx} error`).to.be.not.null;
                    expect(item.emailAddress, `Index: ${idx} error`).to.be.not.null;
                    expect(item.userInfo, `Index: ${idx} error`).to.be.an('object');
                    expect(item.userInfo.userID, `Index: ${idx} error`).to.be.not.null;
                    expect(item.userInfo.profileName, `Index: ${idx} error`).to.be.not.null;
                    expect(item.interactive, `Index: ${idx} error`).to.be.an('object');
                    expect(item, `Index: ${idx} error`).to.have.all.keys('postID',
                        'postContent',
                        'postImage',
                        'postTag',
                        'role',
                        'salary',
                        'number',
                        'company',
                        'address',
                        'emailAddress',
                        'phoneNumber',
                        'interactive',
                        'postCreateTime',
                        'userInfo');
                    expect(item.interactive, `Index: ${idx} error`).to.have.all.keys('attended',
                        'attends',
                        'comments');
                    expect(item.userInfo, `Index: ${idx} error`).to.have.all.keys('userID',
                        'profileName',
                        'avatar');
                })
            } catch (error) {
                throw error
            }

        });
        it('comment recruitment post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query':
                            `mutation{
                                commentRecruitmentPost(
                                commentRecruitmentPostData:${commentRecruitmentPostData}
                            )
                            ${recruitmentPostComment}
                            }`
                    })
                let { commentRecruitmentPost } = res.body.data;
                expect(commentRecruitmentPost).to.be.an('object');
                expect(commentRecruitmentPost).to.have.all.keys('commentID', 'commentContent', 'commentImage', 'commentCreateTime', 'userInfo');
                expect(commentRecruitmentPost.userInfo).to.be.an('object');
                expect(commentRecruitmentPost.userInfo).to.have.all.keys('userID', 'profileName', 'avatar');
                expect(commentRecruitmentPost.commentID).to.be.not.null;
                expect(commentRecruitmentPost.commentContent).to.be.not.null;
                expect(commentRecruitmentPost.commentCreateTime).to.be.not.null;
            } catch (error) {
                throw error
            }

        });
        it('attend recruitment post success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                    .post(`/${process.env.GRAPHQL_ENDPOINT}`)
                    .set('Cookie', Cookies)
                    .send({
                        'query':
                            `mutation{
                                attendRecruitmentPost(
                                    attendRecruitmentPostData:${attendRecruitmentPostData}
                            )
                            ${recruitmentPostAttend}
                            }`
                    })
                let { attendRecruitmentPost } = res.body.data;
                expect(attendRecruitmentPost).to.be.an('object');
                expect(attendRecruitmentPost).to.have.all.keys('postID', 'count', 'attended');
                expect(attendRecruitmentPost.postID).to.be.not.null;
                expect(attendRecruitmentPost.count).to.be.not.null;
                expect(attendRecruitmentPost.count).to.be.a('number');
                expect(attendRecruitmentPost.attended).to.be.not.null;
            } catch (error) {
                throw error
            }

        });
    })
}
