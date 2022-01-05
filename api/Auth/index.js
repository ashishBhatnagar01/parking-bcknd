import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import passport from "passport"

//Models
import {UserModel} from "../../database/User"

//TODO: VAlidation of Form

//Create a Router
const Router=express.Router();

// Router       SignUp
// Des          Register New User
// Params       None
// Access       Public
// Method       Post

Router.post('/signup',async(req,res)=>{
    try {
        //Validation
        await UserModel.findByEmail(req.body);
        const newUser=await UserModel.create(req.body);
        const token = newUser.generateJwtToken();
        return res.status(200).json({token,status:"success",message:"Registration Successfull",icon:"success"})
    } catch (err) {
        return res.status(200).json({message:"User Already Exist, Please login to your account",icon:"error"})
    }
})

// Router       Login
// Des          Login for existing User
// Params       None
// Access       Public
// Method       Post

Router.post('/signin',async(req,res)=>{
    try {
       const check= await UserModel.findByEmailAndPassword(req.body);
        if(check==1){
            return res.status(200).json({message:"Incorrect Password",icon:"warning"})
        }
        else if(check==0){
            return res.status(200).json({message:"Account not found, Kindly Sign Up",icon:"warning"})
        }
        else{
            const token=check.generateJwtToken();
            // localStorage.setItem("tokenId",token)
            return res.status(200).json({token,status:"success",message:"Successfully Logged In!",icon:"success",userDetails:check})
        }
    } catch (error) {
        return res.status(500).json({error:error})
    }
})

// Router       /google
// Des          GoogleSignIn
// Params       None
// Access       Public
// Method       Get

Router.get('/google',passport.authenticate("google",{
    scope:[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
}))

// Router       /google/callback
// Des          GoogleSignIn callback
// Params       None
// Access       Public
// Method       Get

Router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/"}),
(req,res)=>{
    return res.status(200).json({token:req.session.passport.user.token,status:"success"})
}
)


export default Router;