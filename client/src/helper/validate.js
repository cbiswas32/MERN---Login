
import toast from "react-hot-toast";
import { authenticate } from "./authHelper";
/*Validate Register profile page username*/
export async function profileValidate(values){
    const errors = emailVerify({}, values);
    return errors;
}

/*Validate Register page username*/
export async function registerValidate(values){
    const errorUsername = userNameVerify({}, values) ;
    const errorEmail = emailVerify(errorUsername, values);
    const errorPassword = passwordVerify(errorEmail, values);
    const errors =  confirmPasswordVerify(errorPassword, values);
    return errors;
}

/* Validate Reset pasword */
export async function resetPasswordValidate(values){
    const errorPassword = passwordVerify({}, values);
    const errors =  confirmPasswordVerify(errorPassword, values);
}

/*Validate login page username*/
export async function usernameValidate(values){
    const errors = userNameVerify({}, values);
    const {username} = values;
    if(username){
        const {status} = await authenticate(username);
        if(status !== 200){
            errors.exist = toast.error('User does not exist!')
        }
    }
    return errors;
}
/*Validate login page password*/
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);
    return errors;
}
/*Validate recovery page otp*/
export async function otpValidate(values){
    const errors = otpVerify({}, values);
    return errors;
}

/* Validate first Name */
function firstNameVerify(error ={}, values){
    const nameTestRegex = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    if(!values.firstname){
        error.firstname = toast.error(`First Name Required...!`);
    }else if(values.firstname.includes(" ")){
        error.firstname = toast.error(`First Name Invalid...!`);
    }else if(! nameTestRegex.test(values.firstname)){
        error.firstname = toast.error(`Enter a valid First Name...!`);
    }
    return error;
}

/* Validate last Name */
function lastNameVerify(error ={}, values){
    const nameTestRegex = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
    if(!values.lastname){
        error.lastname = toast.error(`Last Name Required...!`);
    }else if(values.lastname.includes(" ")){
        error.lastname = toast.error(`Last Name Invalid...!`);
    }else if(! nameTestRegex.test(values.lastname)){
        error.lastname = toast.error(`Enter a valid Last Name...!`);
    }
    return error;
}

/* Validate mobile  */
function mobileVerify(error ={}, values){
    const mobileTestRegex =/^(\+\d{1,3}[- ]?)?\d{10}$/;
    if(!values.mobileno){
        error.mobileno = toast.error(`Mobile Number Required...!`);
    }else if(values.mobileno.includes(" ")){
        error.mobileno = toast.error(`Mobile Number Invalid...!`);
    }else if(! mobileTestRegex.test(values.mobileno)){
        error.mobileno = toast.error(`Enter a valid Mobile Number...!`);
    }
    return error;
}



/* Validate User Name */
function userNameVerify(error ={}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username...!');
    }
    return error;
}

/* Validate password */
function passwordVerify(error ={}, values){
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if(!values.password){
        error.password = toast.error('Password Required...!');
    }else if(values.password.includes(" ")){
        error.password = toast.error('Invalid Password...!');
    }
    else if(values.password.length <4){
        error.password = toast.error('Password should be more than 4 charecter...!');
    }
    else if(!passwordRegex.test(values.password)){
        error.password = toast.error('Invalid Password, Your password should consist atleast 8 charecter, One Uppercase and One Special Charecter...!');
    }

    return error;
}

/* Email verify */
function emailVerify(error ={}, values){
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if(!values.email){
        error.email = toast.error('Email Required...!');
    }else if(values.email.includes(" ")){
        error.email = toast.error('Invalid Email...!');
    }else if(!emailRegex.test(values.email)){
        error.email = toast.error('Please Enter a Valid Email...!');
    }
    return error;

}

/* Validate OTP */
function otpVerify(error ={}, values){
    const {firstDigitOTP,
    secondDigitOTP,
    thirdDigitOTP, 
    fourthDigitOTP} = values;
    const otpDigits = [firstDigitOTP, secondDigitOTP, thirdDigitOTP, fourthDigitOTP];
    // Check if any OTP digit contains a character or special character
    const containsNonDigit = otpDigits.some(digit => !/^\d$/.test(digit));
    if(!firstDigitOTP ||
        !secondDigitOTP ||
        !thirdDigitOTP || 
        !fourthDigitOTP){
        error.otp = toast.error('Invalid Otp...!');
    } else if (containsNonDigit) {
        error.otp = toast.error('OTP should only contain digits...!');
      }
    return error;
}

/* Email verify */
function confirmPasswordVerify(error ={}, values){
   

    if(!values.confirmPassword){
        error.confirmPassword = toast.error('Confirm Password Required...!');
    }else if(values.confirmPassword.includes(" ")){
        error.confirmPassword = toast.error('Invalid Confirm Password...!');
    }
    else if(values.password !== values.confirmPassword){
        error.confirmPassword = toast.error('Confirm Password does not match with password...!');
    }
    return error;

}