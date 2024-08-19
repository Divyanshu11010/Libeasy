import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";

export async function verifyUserToken(req, res, next) {
    //. Extracting authorization token from HTTP header
    const userToken = req.cookies ? req.cookies.authToken : null;

    if (!userToken) {
        return next();
    }
    else {
        try {
            //. Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    authToken: userToken
                },
            })

            if (!dbtoken) {
                return res.status(401).json({ error: "Unauthorized access(P100)" })
            }

            if (!dbtoken.valid) {
                req.user = null
                return next();
            }

            //. verifying jwt token
            const jwtPayload = jwt.verify(userToken, SECRET_KEY)

            //. Conforming user's profile
            const dbuser = await prisma.user.findUnique({
                where: {
                    id: jwtPayload.tokenID
                }
            })
            if (!dbuser) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }

            //. adding {user: userID} in the req object
            req.user = dbtoken.userID
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                try {
                    await prisma.token.updateMany({
                        where: { authToken: userToken },
                        data: { valid: false },
                    });
                } catch (updateError) {
                    console.error("Error updating token validity: ", updateError);
                }
            } else {
                return res.status(401).json({ error: "Unauthorized access(P103)" });
            }
        } finally {
            next();
        }
    }
}

//! Admin verification
export async function verifyAdminToken(req, res, next) {
    //. Extracting authorization token from HTTP header
    const adminToken = req.cookies ? req.cookies.authToken : null;

    if (!adminToken) {
        return next();
    }
    else {
        try {
            //. Checking if there is any token
            const dbtoken = await prisma.token.findUnique({
                where: {
                    authToken: adminToken
                },
            })

            if (!dbtoken) {
                return res.status(401).json({ error: "Unauthorized access(P100)" })
            }

            if (!dbtoken.valid) {
                req.admin = null
                return next();
            }

            //. verifying jwt token
            const jwtPayload = jwt.verify(adminToken, SECRET_KEY)

            //. Conforming user's profile
            const dbAdmin = await prisma.admin.findUnique({
                where: {
                    id: jwtPayload.tokenID
                }
            })
            if (!dbAdmin) {
                return res.status(401).json({ "error": "Unauthorized access" });
            }

            //. adding {user: userID} in the req object
            req.admin = dbtoken.userID
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                try {
                    await prisma.token.updateMany({
                        where: { authToken: adminToken },
                        data: { valid: false },
                    });
                } catch (updateError) {
                    console.error("Error updating token validity: ", updateError);
                }
            } else {
                return res.status(401).json({ error: "Unauthorized access(P103)" });
            }
        } finally {
            next();
        }
    }
}