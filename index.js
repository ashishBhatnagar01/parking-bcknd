require("@babel/core").transform("code", {
    presets: ["@babel/preset-env"],
  });

require('dotenv').config();
const express=require('express');
const cors=require('cors')
const app=express();
app.use(cors());
app.use(express.json());
import passport from "passport";

//Database Connection
import ConnectDB from "./database/connection"

//API
import Auth from './api/Auth'

//Google Authentication Config
import googleAuthConfig from "./config/google.config"

//Passport COnfig

googleAuthConfig(passport);
app.use(passport.initialize());

//Application Routes
app.get('/',async(req,res)=>{
  return res.json({
    message:"Parking management system API is working"
  })
})
app.use("/auth",Auth);


app.listen(process.env.PORT || 4000,()=>{
  ConnectDB().then(()=>{
    console.log("Server is running and Connection established")
  })
})