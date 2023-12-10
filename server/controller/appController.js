import { createUser, findUserExist, findEmailExist, updateOneUser, updatePassword } from "../model/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import OTPGenerator from 'otp-generator';


/* Middleware for verify User 
@param: {
    "username" : "example123",
}
*/
export async function verifyUser(req, res, next){
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        console.log(username);
        // Check if the user exist
        let exist = await findUserExist(username);
        if(!exist) return  res.status(404).send({error: true, msg: "User not found!"});
        next();
    } catch (error) {
        return  res.status(404).send({error: true, msg: "Authentication Error!"});
        next();
    }
}


/** POST: http://localhost:8080/api/register
 @param: {
    "username" : "example123",
    "password" : "Admin@123",
    "email" : "example123@mail.com",
 }
*/
export async function register(req, res){
    try {
        const {username, password, email, profileImage} = req.body;

        //check the existing user
        const userExist = await findUserExist(username);
        const emailExist = await findEmailExist(email);
        if(userExist){
            return res.status(400).send({error: true, msg: "User already exists with the username!"})
        }
        else if(emailExist){
            return res.status(400).send({error: true, msg: "User already exists with the email!"})
        }
        else{
            if(password){
                bcrypt.hash(password, 10)
                .then( hashedPassword => {
                    const newUser = {
                        username,
                        password : hashedPassword,
                        email,
                        profileImage: profileImage || ''
                    }
                    createUser(newUser).then( result => {
                        return res.status(201).send({msg : "New User Created Successfully!"});
                    }).catch(error => {
                        return res.status(400).send({error: true, msg: "Error in creating new user!"})
                    })


                }).catch( error =>{
                    return res.status(400).send({error: true, msg: "Not able to hash password!"})
                })
            }

        }
        

    } catch (error) {
        return res.status(500).send({error: true, msg: "Problem with the endpoint!"});
    }
}

/** POST: http://localhost:8080/api/login
 @param: {
    "username" : "example123",
    "password" : "Admin@123",
 }
*/
export async function login(req, res){
    const {username, password} = req.body;
    try {
        findUserExist(username)
        .then(
            user => {
                bcrypt.compare(password, user.password)
                .then(
                    passwordCheck => {
                        if(!passwordCheck){
                            return res.status(400).send({error: true, msg: "Don't have password!"})
                        }
                        // Create JWT Token
                        const token = jwt.sign({
                            userId: user._id,
                            username:  user.username
                        }, ENV.JWT_SECRET, {expiresIn : '24h'});

                        return res.status(200).send({ msg: "Login Successfull!",
                        username : user.username,
                        token
                    })

                    }
                )
                .catch(
                    error => {
                        return res.status(400).send({error: true, msg: "Password does not match!"})
            
                    }
                    
                )
            }
        )
        .catch(error => {
            return res.status(404).send({error: true, msg: "Username not found!"})

        })
        
    } catch (error) {
        return res.status(404).send({error: true, msg: "Login Failed!"})
    }

}

/** GET: http://localhost:8080/api/user/<username> */
export async function getUser(req, res){
    // Access the parameter using req.params
    const {username} = req.params;
    try {
        if(!username) return res.status(404).send({error: true, msg: "Invalid Username!"})

        findUserExist(username)
        .then(
            user => {
                // Sending Details without Password
                const {password, ...restDetails} = Object.assign({},user.toJSON());
                console.log(password. restDetails);
                return res.status(201).send(restDetails);
            }
        )
        .catch(
            error =>  res.status(501).send({error: true, msg: `User with ${username} does not exist!`})
        )
        
    } catch (error) {
        return res.status(404).send({error: true, msg: "Get User Details Failed!"})
    }
}

/** PUT: http://localhost:8080/api/updateuser
 @param: {
    "userId" : "XXXXXXXX",
    "firstname" : "John",
    "lastname" : "Doe",
    "mobileno" : "9992224411",
    "address" : "example123",
    "profileImage" : "Base64",
 }
 
*/
export async function updateUser(req, res){
    try {
        const id = req.user.userId;
        if(!id) return res.status(404).send({error: true, msg: "User not Found!"});
        const body = req.body;
        updateOneUser(id, body)
            .then(
                data => res.status(201).send({msg: "User data updated Successfully!"})
            )
            .catch(
                error => res.status(404).send({error: true, msg: "Can not update user data!"})
            )

    } catch (error) {
        return res.status(404).send({error: true, msg: "Update User Failed!"})
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res){
    const OTP = await OTPGenerator.generate(4,{lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    req.app.locals.OTP = OTP;
    res.status(201).send({code: req.app.locals.OTP})

}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res){
    const {code} =req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // Reset the OTP after validation
        req.app.locals.resetSession = true; // Start the session for Password Reset
        return res.status(201).send({msg : "Verified successfully!"})

    }
    return res.status(404).send({error:  "true", msg : "Invalid OTP!"})
}

/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res){
    if(req.app.locals.resetSession){
        //req.app.locals.resetSession = false; // Allow access to the route only once
        return res.status(201).send({flag: req.app.locals.resetSession, msg : "Access granted!"})
    }
    return res.status(440).send({error:  "true", msg : "Session Expired!"})

}

/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res){   
    try {
        if(!req.app.locals.resetSession)  return res.status(440).send({error:  "true", msg : "Session Expired!"});
        
        const { username, password} = req.body;
        const user = await findUserExist(username);
        if (user) {
            const hashPassword = await bcrypt.hash(password, 10);
            const status = await updatePassword(user.username, hashPassword);
            req.app.locals.resetSession = false; 
            return res.status(200).send({ msg: "Reset Password Successful!" });
        } else {
            return res.status(404).send({ error: true, msg: "Username not found!" });
        }
    } catch (error) {
        return res.status(404).send({error: true, msg: "Reset Password Failed!"})
    }

  
}