import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    userName: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            userName: searchParams.get('username')
        }

        // validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().userName?._errors || []

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 
                ? usernameErrors.join(', ')
                : 'Invalid Query Parameters'
            }, {status: 400})
        }

        const { userName } = result.data

        const existingVerifiedUser = await userModel.findOne({userName, isVerified: true})

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {status: 200})
        }

        return Response.json({
            success: true,
            message: 'Username is available'
        }, {status: 200})

    } catch (error) {
        console.log("Error checking username", error)
        return Response.json({
            success: false,
            message: "error checking username"
        }, {status: 500})
    }
}