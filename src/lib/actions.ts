'use server'
import prisma from "./prismaClient";
import { signUpSchema, dropOffSchema, changeCredentialsSchema } from "./zod";
import { hash, compare } from "bcryptjs";
import { flattenError } from "zod/v4";
import { FormState, LoginFormState } from "@/lib/definitions";
import { signIn } from "../auth";
import { auth } from "../auth";
import { DeleteDropoffFormState } from "@/lib/definitions";


export const createUser =  async(previousState: FormState, formData: FormData) => {
    const validatedFields = await signUpSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        return {
            message: 'Invalid Fields. Failed to register.',
            errors: flattenError(validatedFields.error).fieldErrors,
            ok: false
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
            message: 'An account already exists with this email',
            ok: false
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
            message: 'Database Error: Failed to register.',
            ok: false
        };
    }
    return {
        message: 'User registered successfully. You can login now',
        ok: true
    };
}

export const authenticate = async(previousState: LoginFormState, formData: FormData) => {
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

export const addDropoff = async (previousState: FormState, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { 
            message: "Unauthorized Operation",
            ok: false
         };
    }
    const validatedFields = await dropOffSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            message: 'Invalid Fields. Failed to create dropoff.',
            errors: flattenError(validatedFields.error).fieldErrors,
            ok: false
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
        return { 
            message: "Unexpected error, please try again later.",
            ok: false
        };
    }
    return {
        message: 'Dropoff Created Successfully',
        ok: true
    };
}

export const editDropoff = async (previousState: FormState, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { 
            message: "Unauthorized Operation",
            ok: false
        };
    }
    const validatedFields = await dropOffSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        console.log(validatedFields.error)
        return {
            message: 'Invalid Fields. Failed to create dropoff.',
            errors: flattenError(validatedFields.error).fieldErrors,
            ok: false
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
        return { 
            message: "Unexpected error, please try again later.",
            ok: false
        };
    }
    return {
        message: 'Dropoff Updated Successfully',
        ok: true
    };
}

export const deleteDropoff = async (previousState: DeleteDropoffFormState, formData : FormData) => {
    const session = await auth();
    if(!session) {
        return { 
            message: "Unauthorized Operation",
            ok: false
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
            ok: false
        };
    }
    return {
        message: 'Dropoff Deleted Successfully',
        ok: true
    };
}

export const changeCredentials =  async(previousState: FormState, formData: FormData) => {
    const session = await auth();
    if(!session) {
        return { 
            message: "Unauthorized Operation",
            ok: false
        };
    }
    console.log(formData)
    const validatedFields = await changeCredentialsSchema.safeParseAsync(Object.fromEntries(formData));
    if(!validatedFields.success) {
        return {
            message: 'Invalid Fields. Failed to update.',
            errors: flattenError(validatedFields.error).fieldErrors,
            ok: false
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
            message: "User doesn't exist",
            ok: false
        };
    }
    console.log(oldPassword);
    const checkPW = await compare(oldPassword, existingUser.password)
    if(!checkPW) {
        return {
            message: "Invalid Fields. Failed to update.",
            errors: {
                oldPassword: ['Incorrect Password']
            },
            ok: false
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
            message: 'Database Error: Failed to register.',
            ok: false
        };
    }
    return {
        message: 'Credentials updated successfully!',
        ok: true
    };
}

