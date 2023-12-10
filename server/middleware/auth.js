import jwt from "jsonwebtoken";
import ENV from '../config.js';
/* Auth Middleware */
/* Header <token>*/
export default async function Auth(req, res,next){
    try {
        // access authorise header to validate request
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET)
      
        req.user = decodedToken;
        next();
       
    } catch (error) {
        res.status(404).send({
            error: "true",
            msg: "Authentication failed!!!"
        })
    }
}

export function localVeriables(req, res, next){
    req.app.locals ={
        OTP : null,
        resetSession : false
    };
    next();
}