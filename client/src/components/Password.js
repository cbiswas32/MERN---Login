import React from 'react';
import defaultImage from '../assets/defaultprofile.png';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { passwordValidate } from '../helper/validate';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import useFetchDetails from '../hooks/fetchData';
import Loading from './Loading';
import { verifyPassword } from '../helper/authHelper';

export default function Password() {
    const navigate = useNavigate();
    const username = useSelector((state) => state.authReducer.username);
    const [{isLoading, apiData, status, serverError}] = useFetchDetails(`user/${username}`);  
    const [passwordVisible, setPasswordVisible] = useState(false);
    const handlePasswordVisibility = () =>
    {
        if(!passwordVisible){
            setPasswordVisible(true);
        }
        else{
            setPasswordVisible(false);
        }
    }
    const formik = useFormik({
      initialValues: {
        password: ''
      },
      validate: passwordValidate,
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async values => {
        let verifyPassPromise = verifyPassword({username, password:  values.password});
        toast.promise(verifyPassPromise,
          {
            loading: "Verifying Password...",
            success: "Login Successfull!",
            error: "Password does not match!"
          })
          verifyPassPromise.then((res) => 
          {
            const {token} = res.data
            localStorage.setItem('token', token);           
            navigate('/profile')
          
          })
          .catch(
            error => {console.log(error)}
          );  
      },
    }); 
    
    if(isLoading) return  <div className='flex justify-center items-center h-[100vh]'><Loading></Loading></div>;
    if(serverError) return <div className='flex justify-center items-center h-[100vh] w[100%]'><h2 className='text-xl font-bold text-red-500'>{serverError.message}</h2></div>;

    return (
    <div className="container mx-auto">
        <Toaster></Toaster>
        <div className='flex justify-center items-center h-[100vh]'>
        <div className='flex flex-col justify-center items-center bg-neutral-100 p-10 shadow-xl rounded-md'>
          <h2 className='mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 '>Hello {apiData?.firstName || apiData?.username }!</h2>
          <h4 className='mt-2 text-center text-l leading-9 tracking-tight text-gray-400' >Please enter your password to Sign In!</h4>
          <div className="image-container mt-10 border-1 rounded-full p-2 shadow-xl">
            <img className="w-40 h-40 rounded-full username-img " src={apiData?.profileImage || defaultImage} alt="Rounded avatar" ></img>
          </div>
          <form className= 'w-full' onSubmit={formik.handleSubmit}>      
          <div className='relative w-full'>
            <input type={passwordVisible?'text':'password'}  id="password" className="bg-gray-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200  block w-full p-3 mt-6" placeholder="Password"  onChange={formik.handleChange}
                value={formik.values.password}></input>
            <button type="button" className={`absolute right-0 top-1/2 p-2 rounded-lg ${passwordVisible?'bg-red-200':'bg-green-200'} `} style={{transform: 'translate(-50%, -50%)', fontSize: '10px'}} onClick={handlePasswordVisibility}>{passwordVisible?'Hide':'Show'}</button>
          </div>
            <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 mt-8 w-full">Sign In</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
          Forgot password?
          <Link to="/recover/otp" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"> Recover Now</Link>
          </p>
        </div>
      </div>
    </div>
    );
  }