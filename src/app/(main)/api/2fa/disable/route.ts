import prisma from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function PUT() {
    const session = await auth();
    if(!session) {
        return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        await prisma.user.update({
            where: {
                id: +session.user.id
            },
            data: {
                twoFactorEnabled: false,
                twoFactorSecret: null
            }
        })
    } catch(err) {
        console.log(err);
        return Response.json({ ok: false, error: "Unexpected error has occured" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
}