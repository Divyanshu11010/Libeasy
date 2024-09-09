import jwt from "jsonwebtoken";
import prisma from "./prismaClient.js";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "@localSecretDiv";

//! user refresh token verification
export const verifyUserRefToken = async (userRefToken) => {
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: userRefToken },
        });

        if (!dbtoken || !dbtoken.valid) {
            return null;
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(userRefToken, JWT_REFRESH_SECRET);

        //. Confirming user's profile
        const dbuser = await prisma.user.findUnique({
            where: { id: jwtPayload.tokenID },
        });

        if (!dbuser) {
            return null;
        }

        return dbuser.id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: userRefToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            console.error(error);
            res.json({ error: "Internal Server Error" });
        }
        return null;
    }
}

//! admin refresh verification
export const verifyAdminRefToken = async (adminRefToken) => {
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: adminRefToken },
        });

        if (!dbtoken || !dbtoken.valid) {
            return null;
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(adminRefToken, JWT_REFRESH_SECRET);

        //. Confirming user's profile
        const dbAdmin = await prisma.admin.findUnique({
            where: { id: jwtPayload.tokenID },
        });

        if (!dbAdmin) {
            return null;
        }

        return dbAdmin.id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: adminRefToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            console.error(error);
            res.json({ error: "Internal Server Error" });
        }
        return null;
    }
}