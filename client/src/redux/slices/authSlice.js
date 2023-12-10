import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: ''
}

const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        setUsername: (state, action) =>{
            state.username = action.payload
        }
    }


})

export const {setUsername} = authSlice.actions;

export default authSlice.reducer;