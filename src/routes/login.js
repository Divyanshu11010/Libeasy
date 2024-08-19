import express from "express"
import { Router } from "express";

//. for password encryption
import bcrypt from "bcrypt";

//. for db
import { PrismaClient } from "@prisma/client";

//. for token
import { genAuthToken, genRefToken } from "../utils/genAuthToken.js";

//. to parse incoming cookie
import cookieParser from "cookie-parser";

const prisma = new PrismaClient;
const router = Router();

const app = express();
app.use(cookieParser());

//! User login
router.post("/user", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        })

        //. Comparing the db password with entered password
        if (!user) {
            res.status(401).json({ "error": "Unauthorized access" });
        }
        const check = await bcrypt.compare(req.body.password, user.password);

        if (check) {
            //. check if the user is having any valid session in db
            const session = await prisma.token.findMany({
                where: {
                    type: "refresh",
                    valid: true,
                    userID: user.id
                }
            })

            if (!session.length) {
                //. generating access token
                const accessToken = genAuthToken(user.id);
                const refreshToken = genRefToken(user.id);

                //. creating token object in db
                if (accessToken && refreshToken) {
                    // access token
                    await prisma.token.create({
                        data: {
                            authToken: accessToken,
                            valid: true,
                            type: "access",
                            user: {
                                connect: {
                                    email: user.email
                                }
                            }
                        }
                    })

                    // refresh token
                    await prisma.token.create({
                        data: {
                            authToken: refreshToken,
                            valid: true,
                            type: "refresh",
                            user: {
                                connect: {
                                    email: user.email
                                }
                            }
                        }
                    })
                }

                //. Set the cookie with the access token
                const date = new Date();
                const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
                const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

                //. Set the cookie with the access token for admin
                res.cookie('authToken', accessToken, {
                    // domain: "localhost:5000",
                    path: "/user",
                    httpOnly: true,
                    secure: false,
                    expires: accessCookieExp
                });

                //. Set the cookie with the refresh token 
                const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
                const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

                //. Set the cookie with the access token for admin
                res.cookie('refreshToken', refreshToken, {
                    // domain: "localhost:5000",
                    path: "/user",
                    httpOnly: true,
                    secure: false,
                    expires: refreshCookieExp
                });

                res.json({ "message": "successful login" });
            } else {
                res.json({ error: "already logged in :)" });
            }
        }
        else {
            res.json({ "error:": "Wrong Combination" });
        }
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" })
    }
})

//! Admin login
router.post("/admin", async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                username: req.body.username,
            }
        })

        //. Comparing the db password with entered password
        if (!admin) {
            res.status(401).json({ "error": "Unauthorized access" });
        }
        const check = await bcrypt.compare(req.body.password, admin.password);

        if (check) {
            //. check if the user is having any valid session in db
            const session = await prisma.token.findMany({
                where: {
                    type: "refresh",
                    valid: true,
                    userID: admin.id
                }
            })

            if (!session.length) {
                //. generating access token
                const accessToken = genAuthToken(admin.id);
                const refreshToken = genRefToken(admin.id);

                //. creating token object in db
                if (accessToken && refreshToken) {
                    // access token
                    await prisma.token.create({
                        data: {
                            authToken: accessToken,
                            valid: true,
                            type: "access",
                            admin: {
                                connect: {
                                    email: admin.email
                                }
                            }
                        }
                    })

                    // refresh token
                    await prisma.token.create({
                        data: {
                            authToken: refreshToken,
                            valid: true,
                            type: "refresh",
                            admin: {
                                connect: {
                                    email: admin.email
                                }
                            }
                        }
                    })
                }

                //. Set the cookie with the access token
                const date = new Date();
                const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
                const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

                //. Set the cookie with the access token for admin
                res.cookie('authToken', accessToken, {
                    // domain: "localhost:5000",
                    path: "/admin",
                    httpOnly: true,
                    secure: false,
                    expires: accessCookieExp
                });

                //. Set the cookie with the refresh token 
                const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
                const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

                //. Set the cookie with the access token for admin
                res.cookie('refreshToken', refreshToken, {
                    // domain: "localhost:5000",
                    path: "/admin",
                    httpOnly: true,
                    secure: false,
                    expires: refreshCookieExp
                });

                res.json({ "message": "successful login" });
            } else {
                res.json({ error: "already logged in :)" });
            }
        }
        else {
            res.json({ "error:": "Wrong Combination" });
        }
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" })
    }
})

export default router