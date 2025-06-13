import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// signup a new user 
export const Signup = async (req,res)=>{
 const {email,fullName,password,bio} = req.body;
 try {
    if(!fullName || !email || !password || !bio){
        return res.json({
            success:false,
            message:"Please fill all the fields"
        })
    }
    const user = await User.findOne(email);
    if(user){
        return res.json({
            success:false,
            message:"User already exists"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const newUser = await User.create({
        fullName,
        email,
        password:hashedPassword,
        bio
    });
    const token = generateToken(newUser._id);
    res.json({
        success:true,
        message:"User created successfully",
        userData:newUser,
        token
    })
 } catch (error) {
    console.log(error.message);
    res.json({
        success:false,
        message:error.message
    })
 }
}

// login a user
export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password,userData.password);
        if(!isPasswordCorrect){
            return res.json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token = generateToken(userData._id);
        res.json({
            success:true,
            message:"User logged in successfully",
            userData,
            token
        })

    } catch (error) {
         console.log(error.message);
         res.json({
        success:false,
        message:error.message
    })
    }
}

//user is authenticated

export const checkAuth = (req,res)=>{
    res.json({
        success:true,
        message:"User is authenticated",
        userData:req.user
    });
}

// update user profile details 
export const updateProfile = async (req,res)=>{
try {
    const {profilePic,bio,fullName} = req.body;
    const userId = req.user._id;
    let updatedUser;
    if(!profilePic)
    {
        updatedUser= await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
    }
    else{
        const upload = await cloudinary.uploader.upload(profilePic);
        updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic:upload.secure_url,
            bio,
            fullName
        },{new:true});
    }
    res.json({
        success:true,
        message:"Profile updated successfully",
        user:updatedUser
    })
} catch (error) {
      console.log(error.message);
         res.json({
        success:false,
        message:error.message
    })
}
}