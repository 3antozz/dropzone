import prisma from "./prismaClient"
import { auth } from "@/auth"


export const fetchDropoffs = async(query: string, currentPage: number) => {
    const session = await auth();
    const ITEMS_PER_PAGE = 5;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    if(!session) {
        throw new Error('Unauthorized Access')
    }
    try {
        const dropoffs = await prisma.dropoff.findMany({
            where: query ? {
                userId: Number(session.user.id),
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            } :
            {
                userId: Number(session.user.id),
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: offset,
            take: ITEMS_PER_PAGE
        })
        return dropoffs;
    } catch(err) {
        console.log(err)
        throw new Error('Unexpected Error')
    }
}

export const fetchOneDropoff = async(id: string) => {
    const session = await auth();
    if(!session) {
        throw new Error('Unauthorized Access')
    }
    try {
        const dropoff = await prisma.dropoff.findUnique({
            where: {
                id: Number(id),
                userId: Number(session.user.id)
            },
        })
        if(!dropoff) throw new Error("Can't find resource")
        return dropoff;
    } catch(err) {
        console.log(err)
    }
}

export const fetchPagesCount = async(query: string) => {
    const session = await auth();
    const ITEMS_PER_PAGE = 5;
    if(!session) {
        throw new Error('Unauthorized Access')
    }
    try {
        const totalDropoffs = await prisma.dropoff.count({
            where: query ? {
                userId: Number(session.user.id),
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            } :
            {
                userId: Number(session.user.id),
            },
        })
        const pagesCount = Math.ceil(totalDropoffs / ITEMS_PER_PAGE)
        return pagesCount;
    } catch(err) {
        console.log(err)
        throw new Error('Unexpected Error')
    }
}