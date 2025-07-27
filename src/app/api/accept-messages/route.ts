import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userID = user._id
    const {acceptMessages} = await request.json()

    try {
        const UpdatedUser = await userModel.findByIdAndUpdate(
            userID, 
            { isAcceptingMessages: acceptMessages }, 
            { new: true }
        )

        if (!UpdatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: "message acceptance status updated successfully",
            UpdatedUser
        }, {status: 200})
        
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, {status: 500})
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    const userID = user._id

    try {
        const foundUser = await userModel.findById(userID)
    
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, {status: 200})

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "error in getting message acceptance status"
        }, {status: 500})
    }
}