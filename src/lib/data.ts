import prisma from "./prismaClient"
import { auth } from "@/auth"


export const fetchDropoffs = async() => {
    const session = await auth();
    if(!session) {
        throw new Error('Unauthorized Access')
    }
    try {
        const dropoffs = await prisma.dropoff.findMany({
            where: {
                userId: Number(session.user.id)
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        return dropoffs;
    } catch {
        throw new Error('Unexpected Error')
    }
}