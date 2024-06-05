import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

const SECRET_KEY = process.env.JWT_SECRET ||"@localSecret";

export async function verifyToken(req, res, next) {

    /// extracting authorization token from http header
    const authHeader = req.headers["authorization"];
    const userToken = authHeader?.split(" ")[1];
    if (!userToken) {
        return res.status(401).json({ "error": "Unauthorized access" });
    }
    else {
        try {

            /// verifying jwt token
            const jwtPayload = jwt.verify(userToken, SECRET_KEY)

            /// Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    userID: jwtPayload.tokenID
                },
            })

            if (!dbtoken || !dbtoken.valid) {
                return res.json({ "error": "Unauthorized access" });
            }

            /// Conforming user's profile
            const dbuser = await prisma.user.findUnique({
                where: {
                    id: dbtoken.userID
                }
            })

            if (!dbuser) {
                return res.json({ "error": "Unauthorized access" });
            }
            
            req.user = dbtoken.userID
            next();
        } catch (error) {
            console.log(error);
            res.json({ "error": "Unauthorized access" });
        }
    }
}