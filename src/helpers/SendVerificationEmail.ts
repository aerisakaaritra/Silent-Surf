import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'nextjsresendkey@resend.dev',
            to: email,
            subject: 'Unfaced Messages | Verification Code',
            react: VerificationEmail({username, otp: verifyCode})
        });

        return {success: true, message: "email verification sent successfully"}
    } catch (error) {
        console.log("Error sending verification email", error);
        return {success: false, message: "failded to send veification email"}
    }
}