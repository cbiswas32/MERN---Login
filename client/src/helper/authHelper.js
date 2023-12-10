import axios from 'axios';
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

console.log(axios.defaults.baseURL)

/* Make API Requests from the frontend */

/* get username from token */
export async function getUserNameFromToken(){
    try {
        const token =  localStorage.getItem('token');
        console.log(token);
        const decodedJWT = jwtDecode(token);
        console.log(decodedJWT);
        return Promise.resolve(decodedJWT);
    } catch (error) {
        return Promise.reject(error)
    }
}
     

/* Authenticate function*/
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate',{username});
    } catch (error) {
        return{ error : "Username does not exist!" }
    }
}

/* Get User Details */
export async function getUserDetails({username}){
    try {
        const {data} =  await axios.get(`api/user/${username}`);
        return {data};
    } catch (error) {
        return{ error : "Password does not match!!!" }
    }
}

/* Register User */
export async function registerUser(credentials){
    try {
        const {data : {msg}, status} =  await axios.post('/api/register',credentials);
        
        let {username, email} = credentials;
        /*send register email */
        if(status === 201){
            const mailStatus =  await axios.post('/api/registerMail', {username, userEmail: email, subject: msg });
            console.log(mailStatus);

        }
        return Promise.resolve(msg);
    } catch (error) {
        console.log(error);
        return Promise.reject(error)
    }
}

/* Login Function - Verify Password */
export async function verifyPassword({username, password}){
    try {
        if(username){
            const {data} =  await axios.post('api/login',{username, password} );
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({error});
    }
}

/* Login Function - Verify Password */
export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const {data} =  await axios.put('api/updateUser',response, {headers : {"Authorization" : `Bearer ${token}`}} );
        return  Promise.resolve({data});
        
    } catch (error) {
        return Promise.reject({error});
    }
}

/* generate OTP */
export async function generateOTP(username){
    try {
        const {data : {code}, status} =  await axios.get(`api/generateOTP`, {params : {username}})
       
        if(status === 201){
            let {data: {email}} =await getUserDetails({username});
            const intro = `Password Recovery - Your OTP is ${code}`;
            const subject = "Password Recovery OTP Verification!"
            const mailStatus =  await axios.post('/api/sendMail', {username, userEmail: email, subject, intro});
            console.log(mailStatus);

        }
        return  Promise.resolve(code);
    } catch (error) {
        return Promise.reject({error});
    }
}

/* verify OTP */
export async function verifyOTP({username, code}){
    try {
        const {data, status} =  await axios.get(`api/verifyOTP`, {params : {username, code}})
       
        return  {data, status};
    } catch (error) {
        return Promise.reject({error});
    }
}

/* reset password */
export async function resetPassword({username, password}){
    try {
        const {data, status} =  await axios.put(`api/resetPassword`,  {username, password})
       
        return  Promise.resolve({data, status});
    } catch (error) {
        return Promise.reject({error});
    }
}





