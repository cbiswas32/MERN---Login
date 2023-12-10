import React from 'react';
import {createBrowserRouter,
    RouterProvider} from 'react-router-dom';
import Username from './components/Username';
import Password from './components/Password';
import RecoverPasswordOtp from './components/RecoverPasswordOtp';
import Register from './components/Register';
import Profile from './components/Profile';
import Reset from './components/Reset';
/* auth Middleware */
import { AuthorizeUser, ProcectPasswordRoute } from './middleware/authRoutes';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },{
    path: "/register",
    element: <Register></Register>,
  },{
    path: "/password",
    element: <ProcectPasswordRoute><Password/></ProcectPasswordRoute>,
  },
  {
    path: "/recover/otp",
    element: <RecoverPasswordOtp></RecoverPasswordOtp>,
  },
  {
    path: "/profile",
    element: <AuthorizeUser><Profile/></AuthorizeUser>,
  },
  {
    path: "/resetPassword",
    element: <Reset/>,
  }
]);


export default function App() {
  return (
    <main>
        <RouterProvider router={router} />
    </main>
  );
}
