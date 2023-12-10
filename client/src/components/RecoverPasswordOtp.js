import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { otpValidate } from '../helper/validate';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { generateOTP, verifyOTP } from '../helper/authHelper';

export default function RecoverPasswordOtp() {
   
    const navigate = useNavigate();
    const username = useSelector((state) => state.authReducer.username);
    useEffect(()=>{
      const generateOTPPromise =  generateOTP(username)
      toast.promise(generateOTPPromise,
        {
          loading: "Generating OTP.....",
          success: "OTP has been sent to your registered mai!",
          error: "Problem while generating OTP!"
        })

    }, [username])

    async function onSubmit(e){

      e.preventDefault();
      const { data, status } = await verifyOTP({});
      if(status === 201){
        toast.success("Verified Successfully!");
        navigate("/resetPassword")
      }
    }

    const otpDigitValues ={
        firstDigitOTP: '',
        secondDigitOTP: '',
        thirdDigitOTP: '',
        fourthDigitOTP: ''
      }
    const otpDigitArr = Object.keys(otpDigitValues);
    const  handleOtpDigitOnChange  = (e, currentFieldName) =>{
        formik.handleChange(e);
        // Move to the next input
        if (e && e.target && e.target.value !== '') {
        const currentDigitIndex = otpDigitArr.indexOf(currentFieldName);
        const nextDigitIndex = currentDigitIndex + 1;
  
        if (otpDigitArr[nextDigitIndex]) {
          const nextFieldName = otpDigitArr[nextDigitIndex];
          document.getElementById(nextFieldName)?.focus();
        }
      }
    }
    
    const formik = useFormik({
      initialValues: otpDigitValues,
      validate: otpValidate,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async values => {
        console.log(values);
        const { firstDigitOTP, secondDigitOTP, thirdDigitOTP, fourthDigitOTP } = values;
        const otpConcatenated =  firstDigitOTP + secondDigitOTP + thirdDigitOTP + fourthDigitOTP
        const inputOTP = parseInt(otpConcatenated, 10);
        const verifyOTPPromise =  verifyOTP({username, code:  inputOTP});
        toast.promise(verifyOTPPromise,
          {
            loading: "Verifying OTP.....",
            success: "OTP Verified!",
            error: "Invalid OTP!"
          });
          verifyOTPPromise.then(
          ({status}) => {
            if(status === 201){
              navigate("/resetPassword")
              }
          }).catch( e => console.log("Error in Verifying OTP!"))
      },
    });  
    return (
    <div className="container mx-auto">
        <Toaster></Toaster>
        <div className='flex justify-center items-center h-[100vh] '>
        <div className='flex flex-col justify-center items-center bg-neutral-100 p-8 shadow-xl rounded-md w-[350px]'>
          <h2 className='mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 '>Recover Password</h2>
          <h4 className='mt-2 text-center text-sm leading-4 tracking-tight text-gray-400 w-3/4'  >Please enter the OTP sent to your registered email for reset password!</h4>
          <form className= 'w-full flex flex-col items-center justify-center' onSubmit={formik.handleSubmit}> 
               
          <div id="otp" className="flex flex-row justify-center text-center px-2 mt-5">
          {otpDigitArr.map( x =>{
            return <input className="m-2 border h-10 w-10 text-center form-control rounded" onChange ={(e)=> handleOtpDigitOnChange(e, x)}  value={formik.values.x}  type="text" id={x} key={x} maxLength="1" /> 
          })}
            
          </div>
                      
            <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 mt-8 w-3/4">Verify</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
          Did not get OTP?
          <Link to="/recover/otp" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"> Resend</Link>
          </p>
        </div>
      </div>
    </div>
    );
  }