import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//. To make sure user is not using service (delay in min)
const INTERACTING_PERIOD = process.env.INTERACTING_PERIOD || 10;

export async function updateUserToken(req, res, next) {
    try {
        //. fetching user
        const user = await prisma.user.findUnique({
            where: {
                id: req.user
            }
        })

        //. fetching db token 
        const token = await prisma.token.findUnique({
            where: {
                userID: req.user
            }
        })

        //. check if its under expiry period
        if (token.exprTime < new Date()) {
            if (new Date(user.lastVisit + INTERACTING_PERIOD * 60 * 1000) < new Date()) {
                await prisma.token.update({
                    data: {
                        valid: false
                    },
                    where: {
                        userID: req.user
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