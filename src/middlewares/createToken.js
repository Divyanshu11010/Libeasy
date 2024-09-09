import prisma from "../utils/prismaClient.js";
import { genAuthToken, genRefToken } from "../utils/genAuthToken.js";
import { verifyUserRefToken, verifyAdminRefToken } from "../utils/verifyRefToken.js";


//! Refreshing user token
export async function createUserToken(req, res, next) {
    //. check if there is refresh token cookie
    const userRefToken = req.cookies ? req.cookies.refreshToken : null;
    if (!userRefToken) {
        return res.json({ error: "Unauthorized access! Do login" });
    }
    try {
        if (req.user) {
            return next();
        }

        const userId = await verifyUserRefToken(userRefToken);
        if (userId) {
            //. Invalidate all the tokens
            await prisma.token.updateMany({
                where: { userID: userId },
                data: { valid: false },
            });

            //. Generate new tokens in the DB
            const newAccess = genAuthToken(userId);
            const newRefresh = genRefToken(userId);

            //. New access token
            await prisma.token.create({
                data: {
                    authToken: newAccess,
                    valid: true,
                    type: "access",
                    user: { connect: { id: userId } },
                },
            });

            //. New refresh token
            await prisma.token.create({
                data: {
                    authToken: newRefresh,
                    valid: true,
                    type: "refresh",
                    user: { connect: { id: userId } },
                },
            });

            //. Set the cookies with the new tokens
            const date = new Date();
            const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
            const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

            const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
            const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

            res.clearCookie('authToken', { domain: "localhost", path: "/user" });
            res.cookie('authToken', newAccess, {
                domain: "localhost",
                path: "/user",
                httpOnly: true,
                secure: false,
                expires: accessCookieExp,
            });

            res.clearCookie('refreshToken', { domain: "localhost", path: "/user" });
            res.cookie('refreshToken', newRefresh, {
                domain: "localhost",
                path: "/user",
                httpOnly: true,
                secure: false,
                expires: refreshCookieExp,
            });

            //. update user id in req object
            req.user = userId;
            next();
        } else {
            return res.json({ error: "Do Login!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//! refresh of admin token
export async function createAdminToken(req, res, next) {
    //. check if there is refresh token cookie
    const adminRefToken = req.cookies ? req.cookies.refreshToken : null;
    if (!adminRefToken) {
        return res.json({ error: "Unauthorized access(P100)! Do login" });
    }
    try {
        if (req.admin) {
            return next();
        }

        const adminId = await verifyAdminRefToken(adminRefToken);
        if (adminId) {
            //. Invalidate all the tokens
            await prisma.token.updateMany({
                where: { userID: adminId },
                data: { valid: false },
            });

            //. Generate new tokens in the DB
            const newAccess = genAuthToken(adminId);
            const newRefresh = genRefToken(adminId);

            //. New access token
            await prisma.token.create({
                data: {
                    authToken: newAccess,
                    valid: true,
                    type: "access",
                    admin: { connect: { id: adminId } },
                },
            });

            //. New refresh token
            await prisma.token.create({
                data: {
                    authToken: newRefresh,
                    valid: true,
                    type: "refresh",
                    admin: { connect: { id: adminId } },
                },
            });

            //. Set the cookies with the new tokens
            const date = new Date();
            const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
            const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

            const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
            const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

            res.clearCookie('authToken', { domain: "localhost", path: "/admin" });
            res.cookie('authToken', newAccess, {
                domain: "localhost",
                path: "/admin",
                httpOnly: true,
                secure: false,
                expires: accessCookieExp,
            });

            res.clearCookie('refreshToken', { domain: "localhost", path: "/admin" });
            res.cookie('refreshToken', newRefresh, {
                domain: "localhost",
                path: "/admin",
                httpOnly: true,
                secure: false,
                expires: refreshCookieExp,
            });

            //. update admin id in req object
            req.admin = adminId;
        } else {
            return res.json({ error: "Unauthorized access(P102)! Do Login" });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}