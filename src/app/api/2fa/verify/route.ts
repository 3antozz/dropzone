import { verifyToken } from '@/lib/2fa';
import prisma from '@/lib/prismaClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { userId, token } = body;
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
    return NextResponse.json({ ok: true });
}