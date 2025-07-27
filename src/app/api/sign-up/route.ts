import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json()

        const existingUserVerfiedbyUsername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerfiedbyUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await userModel.findOne ({email})

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "username is already exists with this email"
                }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verificationCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                userName: username,
                userEmail: email,
                password : hashedPassword,
                verificationCode : verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessages : true,
                messages : []
            })

            await newUser.save()
        }

        // Send verification Email
        const emailResponse = await SendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User Registered Successsfully, please verify your email"
        }, {status: 201})

    } catch (error) {
        console.error('Error Registering User', error);

        return Response.json ({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}