import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http';
import { signUpData, signUpRespone, signInData, signInRespone, verifyEmailData,verifyEmailRespone } from './dataTest'
const should = chai.should()
chai.use(chaiHttp);
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
export const userTest = () => {
    return describe('User Automation Test', () => {
        // it('sign up success', async () => {
        //     try {
        //         const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
        //                               .post(`/${process.env.GRAPHQL_ENDPOINT}`).send({
        //                                         'query':`mutation{signUp(signUpData:${signUpData})${signUpRespone}}`
        //                                     })
        //         res.body.data.signUp.should.to.be.an('object');
        //         res.body.data.signUp.isSuccess.should.to.equal('true');
        //     } catch (error) {
        //         throw error
        //     }

        // });
        // it('verify email success', async () => {
        //     try {
        //         const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
        //                               .post(`/${process.env.GRAPHQL_ENDPOINT}`).send({
        //                                         'query':`{verifyEmail(secretKey:${verifyEmailData})${verifyEmailRespone}}`
        //                                     })
        //         res.body.data.verifyEmail.should.to.be.an('object');
        //         res.body.data.verifyEmail.status.should.to.equal('Actived');
        //     } catch (error) {
        //         throw error
        //     }

        // });
        it('sign in success', async () => {
            try {
                const res = await chai.request(`${process.env.HOST_NAME_DEV}:${process.env.PORT}`)
                                      .post(`/${process.env.GRAPHQL_ENDPOINT}`).send({
                                                'query':`mutation{signIn(signInData:${signInData})${signInRespone}}`
                                            })
                res.body.data.signIn.should.to.be.an('object');
                res.body.data.signIn.isSuccess.should.to.equal(true);
                res.body.data.signIn.jwt.should.not.be.equal(null);
                should.not.exist(res.body.data.signIn.message);
            } catch (error) {
                throw error
            }

        })
    })
}
