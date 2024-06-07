import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

const SECRET_KEY = process.env.JWT_SECRET ||"@localSecret";

export async function verifyToken(req, res, next) {

    //. extracting authorization token from http header
    const userToken = req.cookies.authToken;
    if (!userToken) {
        return res.status(401).json({ "error": "Unauthorized access" });
    }
    else {
        try {

            //. verifying jwt token
            const jwtPayload = jwt.verify(userToken, SECRET_KEY)

            //. Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    userID: jwtPayload.tokenID
                },
            })

            if (!dbtoken || !dbtoken.valid) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }

            //. Conforming user's profile
            const dbuser = await prisma.user.findUnique({
                where: {
                    id: dbtoken.userID
                }
            })

            if (!dbuser) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }
            
            //. adding {user: userID} in the req object
            req.user = dbtoken.userID
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ "error": "Unauthorized access" });
        }
    }
}