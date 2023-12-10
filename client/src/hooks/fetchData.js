import {useEffect, useState} from 'react';
import axios from 'axios';
import { getUserNameFromToken } from '../helper/authHelper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
//Custom Hook useFetchDetails

export default function useFetchDetails(query){
    const [getData, setData] = useState({
        isLoading : false, apiData: undefined, status: null, serverError: undefined
    })
    
    useEffect(()=>{
        const fetchData =  async () =>{
            try {
                let username = undefined;
                if(!query){
                    // Use Token for fetting the user name
                    const decoded = await getUserNameFromToken();
                    console.log(decoded);
                    username = decoded.username;
                }
                setData(prev => ({...prev, isLoading:true}));
                const {data,status} = !query ? await axios.get(`/api/user/${username}`): await axios.get(`/api/${query}`);
                if(status === 201){
                    setData(prev => ({...prev, isLoading:false, apiData: data, status}));
                }
                setData(prev => ({...prev, isLoading:false, status}));
                console.log(getData);
            } catch (error) {
                setData(prev => ({...prev, isLoading:false, serverError:error}))
            }
        }
        fetchData();


    }, [query]);

    return [getData, setData];
}
