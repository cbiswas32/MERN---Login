import React from 'react';
import defaultImage from '../assets/defaultprofile.png';
import chinmoyImage from '../assets/chinmoy.jpg';
import style from '../style/InputStyle.js';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { profileValidate } from '../helper/validate';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import useFetchDetails from '../hooks/fetchData';
import Loading from './Loading';
import { updateUser, userLogout } from '../helper/authHelper.js';

export default function Profile() {  
  const [{
    isLoading, apiData, status, serverError}] = useFetchDetails();  
  const [imageFile,setImageFile] = useState(''); 
 
  const userLogout = () => {
    Toaster.loading ="Loging out...";
    localStorage.removeItem('token');
  }
  
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
        firstname: apiData?.firstname || '',  
        lastname:  apiData?.lastname || '',
        mobile: apiData?.mobile || '',
        email: apiData?.email || '',
        address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let updateuserPromise = updateUser(values);
      toast.promise(updateuserPromise,
        {
          loading: "Updating User Details...",
          success: "Successfull!",
          error: "Failed to update!"
        })
      console.log(values, values.profileImage = imageFile || apiData?.profileImage ||'');
    },
  });  

  if(isLoading) return  <div className='flex justify-center items-center h-[100vh]'><Loading></Loading></div>;
  if(serverError) return  <div className='flex justify-center items-center h-[100vh] w[100%]'><h2 className='text-xl font-bold text-red-500'>{serverError.message}</h2></div>;
  return (
  <div className="container mx-auto">
      <Toaster></Toaster>
      <div className='flex justify-center items-center h-[100vh]'>
      <div className='flex flex-col justify-center items-center bg-neutral-100 p-10 shadow-xl rounded-md w-[350px]'>
        <h2 className={style.headertext}>Update Profile</h2>
        <div className="image-container mt-10 border-1 rounded-full p-2 shadow-xl mb-4">
        <label htmlFor="profileImage">
            <img className={style.profileimg} src={imageFile || apiData?.profileImage ||defaultImage} alt="Rounded avatar" ></img>
        </label>
            <input type="file" accept="image/*" id="profileImage"  className="hidden" onChange={handleProfileImage}></input>
        </div>
        <form className= 'w-full flex flex-col' onSubmit={formik.handleSubmit}>
        <div className="input-row-1 w-full flex flex-row space-x-4">
            <input type="text" id="firstname" className={style.inputbox} placeholder="First Name"  onChange={formik.handleChange}
            value={formik.values.firstname}></input>
            <input type="text" id="lastname" className={style.inputbox} placeholder="Last Name"  onChange={formik.handleChange}
            value={formik.values.lastname}></input>
        </div>
        <div className="input-row-2  w-full flex flex-row space-x-4">
            <input type="text" id="mobile" className={style.inputbox} placeholder="Mobile No."  onChange={formik.handleChange}
            value={formik.values.mobile} ></input>
            <input type="text" id="email" className={style.inputbox} placeholder="Email Id"  onChange={formik.handleChange}
            value={formik.values.email}></input>
        </div>

        <input type="text" id="address" className={style.inputbox + ' pb-10'} placeholder="Address"  onChange={formik.handleChange}
          value={formik.values.address} ></input>  
          
          <button type="submit" className={style.submitbtn}>Update</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
        Come back later?
        <Link to="/" onClick={userLogout} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"> Logout</Link>
        </p>
      </div>
    </div>
  </div>
  );
}
