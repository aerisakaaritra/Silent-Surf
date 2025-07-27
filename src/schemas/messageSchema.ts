import { z } from "zod";

export const messageSchema = z.object({
    message : z
        .string()
        .min(5, "your message must be atleast 5 characters")
        .max(300, "your message should be no longer than 300 characters")
})