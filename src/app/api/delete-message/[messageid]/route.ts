import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: {params: {messageid: string}}) {

    const messageId = params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    try {
        const updatedResult = await userModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json({ 
                message: 'Message not found or already deleted', 
                success: false 
            },{ status: 404 })
        }

        return Response.json({ 
            message: 'Message deleted', 
            success: true 
        },{ status: 200 })
    } catch (error) {
        console.error('Error deleting message', error);
        return Response.json({
            success: false,
            message: 'Error deleting message'
        }, { status: 500 })
    }
} 