import React from 'react';
import defaultImage from '../assets/defaultprofile.png';
import chinmoyImage from '../assets/chinmoy.jpg';
import style from '../style/InputStyle.js';
import { Link,useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUsername } from '../redux/slices/authSlice.js';
export default function Username() {
  const storedUsername = useSelector((state) => state.authReducer.username);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      dispatch(setUsername(values.username));
      console.log(values);
      navigate('/password')
    },
  });  
  return (
  <div className="container mx-auto">
      <Toaster></Toaster>
      <div className='flex justify-center items-center h-[100vh]'>
      <div className='flex flex-col justify-center items-center bg-neutral-100 p-10 shadow-xl rounded-md'>
        <h2 className='mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 '>Hello Again!</h2>
        <h4 className='mt-2 text-center text-l leading-9 tracking-tight text-gray-400' >Explore more by connecting with us!</h4>
        <div className="image-container mt-10 border-1 rounded-full p-2 shadow-xl">
            <img className="w-40 h-40 rounded-full username-img " src={defaultImage} alt="Rounded avatar" ></img>
        </div>
        <form className= 'w-full' onSubmit={formik.handleSubmit}>
          <input type="text" id="username" className="bg-gray-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200  block w-full p-3 mt-10" placeholder="Username"  onChange={formik.handleChange}
          value={formik.values.username}required></input>
          <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center mb-2 mt-8 w-full ">Let's Go</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
        Not a member?
        <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"> Register Now</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
