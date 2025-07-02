'use server'
import prisma from "./prismaClient";
import { signUpSchema, dropOffSchema, changeCredentialsSchema } from "./zod";
import { hash, compare } from "bcryptjs";
import { flattenError } from "zod/v4";
import { State } from "./zod";
import { signIn } from "../auth";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";


export const createUser =  async(previousState: State, formData: FormData) => {
    const validatedFields = await signUpSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        return {
            message: 'Invalid Fields. Failed to register.',
            errors: flattenError(validatedFields.error).fieldErrors
        }
    }
    const { email, password } = validatedFields.data;
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(existingUser) {
        return {
            message: 'An account already exists with this email'
        };
    }
    try {
        const hashPW = await hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashPW
            }
        })
    } catch(err) {
        console.log(err)
        return {
            message: 'Database Error: Failed to register.'
        };
    }
    return {
        message: 'User registered Successfully'
    };
}

export const authenticate = async(previousState: State, formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
        await signIn("credentials", {redirect: false, email, password});
    } catch {
        return {
            message: "Invalid credentials",
        };
    }
    const session = await auth();
    if(session?.user?.twoFactorPending) {
        return {
            message: "",
            redirectTo: "/2fa-login"
        };
    }
    if(!session?.user?.twoFA) {
        return {
            message: "",
            redirectTo: "/2fa-setup"
        };
    }
    return {
        message: "",
        redirectTo: "/dashboard"
    };
}

export const disable2FA = async () => {
    const session = await auth();
    if(!session) {
        return { ok: false, error: "Unauthorized Operation" };
    }
    try {
        await prisma.user.update({
            where: {
                id: Number(session.user.id)
            },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null
            }
        })
    } catch(err) {
        console.log(err);
        return { ok: false, error: "Unexpected error, please try again later." };
    }
    return { ok: true };
}

export const addDropoff = async (previousState: State, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { message: "Unauthorized Operation" };
    }
    const validatedFields = await dropOffSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            message: 'Invalid Fields. Failed to create dropoff.',
            errors: flattenError(validatedFields.error).fieldErrors
        }
    }
    const {title, description, lat, lng } = validatedFields.data;
    try {
        await prisma.dropoff.create({
            data: {
                User: {
                    connect: {
                        id: Number(session.user.id)
                    }
                },
                title,
                description,
                latitude: lat,
                longitude: lng
            }
        })
    } catch {
        return { message: "Unexpected error, please try again later." };
    }
    return {
        message: 'Dropoff Created Successfully'
    };
}

export const editDropoff = async (previousState: State, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { message: "Unauthorized Operation" };
    }
    const validatedFields = await dropOffSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            message: 'Invalid Fields. Failed to create dropoff.',
            errors: flattenError(validatedFields.error).fieldErrors
        }
    }
    const {title, description, lat, lng, id } = validatedFields.data;
    try {
        await prisma.dropoff.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                description,
                latitude: lat,
                longitude: lng
            }
        })
    } catch {
        return { message: "Unexpected error, please try again later." };
    }
    return {
        message: 'Dropoff Updated Successfully'
    };
}

export const deleteDropoff = async (previousState: State, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { 
            message: "Unauthorized Operation",
            error: 'Error'
        };
    }
    const id = formData.get('id');
    try {
        await prisma.dropoff.delete({
            where: {
                userId: Number(session.user.id),
                id: Number(id)
            }
        })
    } catch {
        return { 
            message: "Unexpected error, please try again later.", 
            error: 'Error'
        };
    }
    revalidatePath('/dashboard')
    return {
        message: 'Dropoff Deleted Successfully',
    };
}

export const changeCredentials =  async(previousState: State, formData: FormData) => {
    const session = await auth();
    if(!session) {
        return { message: "Unauthorized Operation" };
    }
    console.log(formData)
    const validatedFields = await changeCredentialsSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        return {
            message: 'Invalid Fields. Failed to update.',
            errors: flattenError(validatedFields.error).fieldErrors
        }
    }
    const { email, password, oldPassword } = validatedFields.data;
    const existingUser = await prisma.user.findUnique({
        where: {
            id: Number(session.user.id)
        }
    })
    if(!existingUser) {
        return {
            message: "User doesn't exist"
        };
    }
    console.log(oldPassword);
    const checkPW = await compare(oldPassword, existingUser.password)
    if(!checkPW) {
        return {
            message: "Password Incorrect"
        };
    }
    try {
        const hashPW = await hash(password, 10);
        await prisma.user.update({
            where: {
                id: Number(session.user.id)
            },
            data: {
                email,
                password: hashPW
            }
        })
    } catch(err) {
        console.log(err)
        return {
            message: 'Database Error: Failed to register.'
        };
    }
    return {
        message: 'User registered Successfully',
        redirectTo: "/settings?credsupdate=true"
    };
}

