const email = 'emailTest2@gmail.com';

//Todo: SignUp data test
export const signUpData = `{
    firstName:"Duy",
    lastName:"Long",
    email:"${email}",
    passWord:"longkhanh94",
    dateOfBirth: "21/08/1994",
    gender: "M"
}`;
export const signUpRespone = `{
    isSuccess
    message
}`;
//Todo: SignIn data test
export const signInData = `{
    email:"${email}",
    passWord:"longkhanh94"
}`;
export const signInRespone = `{
    isSuccess
    message
    jwt
}`;
//Todo: VerifyEmail data test
const urlEndPoint =new Buffer(email).toString('base64');
export const verifyEmailData = `"${urlEndPoint}"`;
export const verifyEmailRespone = `{
    status
}`;