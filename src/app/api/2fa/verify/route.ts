import { verifyToken } from '@/lib/2fa';
import prisma from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { signIn } from "@/auth";

export async function POST(req: Request) {
    const cookieStore = await cookies()
    const body = await req.json();
    let userId = body.userId;
    let cookie = false;
    if(!userId) {
        userId = cookieStore.get("2fa_user")?.value;
        if(userId) {
            cookie = true
        }
    }
    if (!userId) return Response.json({ ok: false });
    const { token } = body;
    let { secret } = body;
    const user = await prisma.user.findUnique({ where: { id: +userId } });
    const userSecret = user && user.twoFactorSecret;
    secret = secret || userSecret;
    if (!user || !secret) return NextResponse.json({ ok: false });

    const valid = verifyToken(token, secret);
    if (!valid) return NextResponse.json({ ok: false });
    if(!user.twoFactorEnabled) {
        await prisma.user.update({
            where: {
                id: +userId
            },
            data: {
                twoFactorEnabled: true,
                twoFactorSecret: secret
            }
        })
    }
    if(cookie) {
        await signIn("credentials", {
            redirect: false,
            email: user.email,
            flag: "2fa-complete",
            twoFA: true
        });
        cookieStore.delete("2fa_user");
    }
    return NextResponse.json({ ok: true });
}