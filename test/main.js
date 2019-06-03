
import { userTest } from './users/userTest';
import { defaultPostTest } from './posts/default_posts/defaultPostTest';
import "regenerator-runtime/runtime";
import chai from 'chai'
import chaiHttp from 'chai-http';
import { signInData, signInRespone } from './users/dataTest'
const should = chai.should()
chai.use(chaiHttp);
require('dotenv').config();
describe('Main', async () => {
    beforeEach(done => {
        done()
    })
    //userTest();
    defaultPostTest();
})
