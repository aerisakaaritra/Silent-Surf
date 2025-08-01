import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


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

    const userID = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await userModel.aggregate([
            { $match: {id: userID} },
            { $unwind: '$messages' },
            { $sort: {'messages.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push: '$messages'}} }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message: user[0].messages
        }, {status: 200})

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 })
    }
}