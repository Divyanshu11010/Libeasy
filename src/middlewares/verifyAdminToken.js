import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";

export async function verifyAdminToken(req, res, next) {

    //. extracting authorization token from http header
    const adminToken = req.cookies.authToken;
    if (!adminToken) {
        return res.status(401).json({ "error": "Unauthorized access" });
    }
    else {
        try {

            //. verifying jwt token
            const jwtPayload = jwt.verify(adminToken, SECRET_KEY)

            //. Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    userID: jwtPayload.tokenID
                },
            })

            if (!dbtoken || !dbtoken.valid) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }

            //. Conforming admin's profile
            const dbAdmin = await prisma.admin.findUnique({
                where: {
                    id: dbtoken.userID
                }
            })
            if (!dbAdmin) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }

            //. adding {admin: adminID} in the req object
            req.admin = dbtoken.userID
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ "error": "Unauthorized access" });
        }
    }
}