import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUSername = decodeURIComponent(username)
        const user = await userModel.findOne({userName: decodedUSername})

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 500})
        }

        const isCodeValid = user.verificationCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "your code has expired, please signup again to get new code"
            }, {status: 400})
        } else {
            return Response.json({
                success: false,
                message: "Invalid Verification Code"
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Account verified successfully"
        }, {status: 200})
    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json({
            success: false,
            message: "error verifying user"
        }, {status: 500})
    }
}