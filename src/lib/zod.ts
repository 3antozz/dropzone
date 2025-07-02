import * as z from "zod/v4"; 

export type State = {
    message: string,
    errors?: Record<string, string[]>; 
    redirectTo?: string
}

export const signUpSchema = z.object({
    email: z.email("Invalid email").trim(),
    password: z.string().trim()
        .min(6, "Password must be atleast 6 characters")
        .max(32, "Password must be less than 32 characters").trim(),
    confirm: z.string().trim()
}).refine((data) => data.confirm === data.password, {
            error: "Passwords don't match",
            path: ["confirm"]})

export const signInSchema = z.object({
    email: z.email("Invalid email").trim(),
    password: z.string().trim()
        .min(6, "Password must be atleast 6 characters")
        .max(32, "Password must be less than 32 characters").trim(),
})

export const dropOffSchema = z.object({
    id: z.optional(z.string()),
    title: z.string().trim()
        .min(3, "Title must be atleast 3 characters"),
    description: z.optional(z.string().trim()),
    lat: z.coerce.number("Location coordinate must be a number"),
    lng: z.coerce.number("Location coordinate must be a number"),
})

export const changeCredentialsSchema = z.object({
    email: z.email("Invalid email").trim(),
    password: z.string().trim()
        .min(6, "Password must be atleast 6 characters")
        .max(32, "Password must be less than 32 characters").trim(),
    confirm: z.string().trim(),
    oldPassword: z.string().trim(),
}).refine((data) => data.confirm === data.password, {
            error: "Passwords don't match",
            path: ["confirm"]})