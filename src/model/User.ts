import mongoose  from "mongoose";
import { Schema, Document } from "mongoose";

export interface Message extends Document {
    _id : string;
    content : string;
    createdAt : Date;
}

export interface User extends Document {
    userName : string,
    userEmail : string,
    password : string,
    verificationCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessages : boolean,
    messages : Message[]
}

const messageSchema : Schema<Message> = new Schema({
    content: {
        type : String,
        required : true
    },
    createdAt: {
        type : Date,
        required : true,
        default : Date.now
    }
})

const userSchema : Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
      },
      userEmail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      verificationCode: {
        type: String,
        required: [true, 'Verify Code is required'],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isAcceptingMessages: {
        type: Boolean,
        default: true,
      },
      messages: [messageSchema]
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))

export default userModel