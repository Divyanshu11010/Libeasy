import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// To make sure user is not using service (delay in min)
const INTERACTING_PERIOD = process.env.INTERACTING_PERIOD || 10;

export async function updateAdminToken(req, res, next) {
    try {
        //. fetching user
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.admin
            }
        })

        //. fetching db token 
        const token = await prisma.token.findUnique({
            where: {
                userID: req.admin
            }
        })

        //. check if its under expiry period
        if (token.exprTime < new Date()) {
            if (new Date(admin.lastVisit + INTERACTING_PERIOD * 60 * 1000) < new Date()) {
                await prisma.token.update({
                    data: {
                        valid: false
                    },
                    where: {
                        userID: req.admin
                    }
                })
            }
        }
        // Token gets invalidated accordingly
        next();
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
}