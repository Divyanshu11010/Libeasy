import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function lastUserVisit(req, res, next) {
    try {
        await prisma.user.update({
            data: {
                lastVisit: new Date()
            },
            where: {
                id: req.user
            }
        })
        // visit updated
        next();
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
}