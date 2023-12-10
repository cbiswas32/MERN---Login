import React from 'react';
import defaultImage from '../assets/defaultprofile.png';
import chinmoyImage from '../assets/chinmoy.jpg';
import style from '../style/InputStyle.js';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { registerValidate } from '../helper/validate';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { registerUser } from '../helper/authHelper.js';


export default function Register() { 
  const navigate = useNavigate() 
  const [imageFile,setImageFile] = useState('');  
  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageFile(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }
  const formik = useFormik({
    initialValues: {
      email: '',  
      username: '',
      password: '',
      confirmPassword: ''
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      const {email, username, password, profileImage} = values;
      const credentials = {email, username, password, profileImage}
      console.log(values, values.profileImage = imageFile);
      let registerPromise = registerUser(credentials);
      toast.promise(registerPromise,{
        loading: "Creating",
        success: "Successfully Registered!",
        error: "Registration Failed!"
      })
      registerPromise.then(() => {navigate('/')}).catch(
        error => {console.log(error)}
      );
    },
  });  
  return (
  <div className="container mx-auto">
      <Toaster></Toaster>
      <div className='flex justify-center items-center h-[100vh]'>
      <div className='flex flex-col justify-center items-center bg-neutral-100 p-10 shadow-xl rounded-md w-[350px]'>
        <h2 className={style.headertext}>Register</h2>
        <h4 className='mt-2 text-center text-l leading-9 tracking-tight text-gray-400' >Please fill the details!</h4>
        <div className="image-container mt-10 border-1 rounded-full p-2 shadow-xl">
        <label htmlFor="profileImage">
            <img className={style.profileimg} src={imageFile?imageFile:defaultImage} alt="Rounded avatar" ></img>
        </label>
            <input type="file" accept="image/*" id="profileImage"  className="hidden" onChange={handleProfileImage}></input>
        </div>
        <form className= 'w-full' onSubmit={formik.handleSubmit}>
          <input type="email" id="email" className={style.inputbox + ` mt-8`} placeholder="Email Id"  onChange={formik.handleChange}
          value={formik.values.email}></input>
          <input type="text" id="username" className={style.inputbox} placeholder="Username"  onChange={formik.handleChange}
          value={formik.values.username} ></input>
          <input type="password" id="password" className={style.inputbox} placeholder="Password"  onChange={formik.handleChange}
          value={formik.values.password} ></input>
           <input type="confirmPassword" id="confirmPassword" className={style.inputbox} placeholder="Confirm Password"  onChange={formik.handleChange}
          value={formik.values.confirmPassword} ></input>
          
          <button type="submit" className={style.submitbtn}>Sign Up</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
        Already registered?
        <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"> login</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
