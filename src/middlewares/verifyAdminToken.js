import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

const SECRET_KEY = process.env.JWT_SECRET ||"@localSecret";

export async function verifyAdminToken(req, res, next) {

    /// extracting authorization token from http header
    const authHeader = req.headers["authorization"];
    const adminToken = authHeader?.split(" ")[1];
    if (!adminToken) {
        return res.status(401).json({ "error": "Unauthorized access" });
    }
    else {
        try {

            /// verifying jwt token
            const jwtPayload = jwt.verify(adminToken, SECRET_KEY)

            /// Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    userID: jwtPayload.tokenID
                },
            })

            if (!dbtoken || !dbtoken.valid) {
                return res.json({ "error": "Unauthorized access" });
            }

            /// Conforming admin's profile
            const dbAdmin = await prisma.admin.findUnique({
                where: {
                    id: dbtoken.userID
                }
            })

            if (!dbAdmin) {
                return res.json({ "error": "Unauthorized access" });
            }
            
            req.admin = dbtoken.userID
            next();
        } catch (error) {
            console.log(error);
            res.json({ "error": "Unauthorized access" });
        }
    }
}