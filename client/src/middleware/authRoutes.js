import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";



export const AuthorizeUser = ({ children }) => {
    const token  = localStorage.getItem('token');
    if(!token){
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}

export const ProcectPasswordRoute = ({ children }) => {
    const username = useSelector((state) => state.authReducer.username);
    if(!username){
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}