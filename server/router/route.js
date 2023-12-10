import { Router } from "express";
import { register, login, getUser, generateOTP, verifyOTP, updateUser, resetPassword, verifyUser, createResetSession } from "../controller/appController.js";
import { registerMail, sendMail } from "../controller/mailer.js";
import Auth, {localVeriables} from '../middleware/auth.js';
const router = Router();



/* POST Method */ 
router.route('/register').post(register);
router.route('/registerMail').post(registerMail);
router.route('/sendMail').post(sendMail);
router.route('/authenticate').post(verifyUser, (req, res) => res.end());
router.route('/login').post(login);
 

/* GET Method */ 
router.route('/user/:username').get(getUser);
router.route('/generateOTP').get(verifyUser, localVeriables,generateOTP);
router.route('/verifyOTP').get(verifyUser, verifyOTP);
router.route('/createResetSession').get(createResetSession);

/* PUT Method */ 
router.route('/updateuser').put(Auth, updateUser)
router.route('/resetPassword').put(verifyUser, resetPassword)


export default router;