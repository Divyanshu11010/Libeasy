import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function lastAdminVisit(req, res, next) {
    try {
        await prisma.admin.update({
            data: {
                lastVisit: new Date()
            },
            where: {
                id: req.admin
            }
        })
        console.log("new visit");
        next();
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
}