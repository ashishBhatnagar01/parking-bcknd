import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const UserSchema= new mongoose.Schema({
  userName:{type:String,required:true},
  mailId:{type:String,required:true},
  password:{type:String}
},{
    timestamps:true
})

UserSchema.methods.generateJwtToken=function(){
    return jwt.sign({user:this._id.toString},"ZomatoApp")
}

UserSchema.statics.findByEmail=async({mailId})=>{
    const checkUserByEmail=await UserModel.findOne({mailId});
    if(checkUserByEmail){
        throw new Error("User Already Exist")
    }
    return false;
}
UserSchema.statics.findByEmailAndPassword=async({mailId,password})=>{
    const user=await UserModel.findOne({mailId});
    if(!user){
        return 0;
    }
    const doesPasswordMatch=await bcrypt.compare(password,user.password)
    
    if(!doesPasswordMatch){
        return 1;
    }
    return user;
}
UserSchema.pre("save",function(next){
    const user=this;

    if(!user.isModified("password")) return next();

    bcrypt.genSalt(8,(error,salt)=>{
        if(error) return next(error);
        bcrypt.hash(user.password,salt,(error,hash)=>{
            if(error) return next(error)
            user.password=hash;
            return next();
        })
    })

})

export const UserModel=mongoose.model("users",UserSchema)