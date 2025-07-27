import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

import { Message } from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    const { userName, content } = await request.json()

    try {
        const user = await userModel.findOne({userName}).exec()

        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 404 })
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: 'user is currently not accepting messages'
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success: true,
            message: 'your message has been successfully'
        }, { status: 201 })
        
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 })
    }

}