import mongoose, { Schema } from "mongoose";

// Define the user schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required : [true, "Please provide unique Username"],
            unique : [true, "Username Exist"]
        },
        password: {
            type: String,
            required : [true, "Please provide a password"],
            unique :  false
        },
        email: {
            type: String,
            required : [true, "Please provide a email"],
            unique : [true, "Email Exist"]
        },
        firstname : { type: String},
        lastname : { type: String},
        mobile : { type: String},
        address : { type: String},
        profileImage : { type: String},
    }
);

// Create the User model
const User = mongoose.model('User', userSchema);

// Function to create a new user
const createUser = async (userData) => {
    try {
        const newUser = await User.create(userData);
        console.log('User created:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Update user
const updateOneUser = async(userId, body) => {
    try {
        const updated = await User.updateOne({_id:  userId}, body);
        console.log('User Updated:', updated);
        return updated;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

//updatePassword

const updatePassword = async(userName, hashedpassword) => {
    try {
        const updatedPassword = await User.updateOne({username : userName}, {password: hashedpassword});
        console.log('Password Updated:', updatedPassword);
        return updatedPassword;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to find a user by username
const findUserExist = async (username) => {
    try {
        const user = await User.findOne({username});
        console.log('User found:', user);
        return user;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

// Function to find a user by email
const findEmailExist = async (email) => {
    try {
        const emailId = await User.findOne({email});
        console.log('Email found:', emailId);
        return emailId;
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};
// Function to find all users
const findAllUsers = async () => {
    try {
        const users = await User.find();
        console.log('All users:', users);
        return users;
    } catch (error) {
        console.error('Error finding all users:', error);
        throw error;
    }
};

export { User, createUser, findUserExist, findAllUsers,findEmailExist, updateOneUser,updatePassword };


