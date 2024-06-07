import express from "express"
import { Router } from "express";

//. for password encryption
import bcrypt from "bcrypt";

//. for db
import { PrismaClient } from "@prisma/client";

//. for token
import genAuthToken from "../utils/genAuthToken.js";

//. to generate expiration period for token
import expiry from "../utils/expiry.js";

//. to parse incoming cookie
import cookieParser from "cookie-parser";

const prisma = new PrismaClient;
const router = Router();

const app = express();
app.use(cookieParser());

//. cookie expiration for 7 days
const cookieExpr = new Date(Date.now() + 24 * 7 * 3600 * 1000);

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

            //. generating access token
            const accessToken = genAuthToken(user.id);

            //. creating token object in db
            if (accessToken) {
                await prisma.token.create({
                    data: {
                        authToken: accessToken,
                        valid: true,
                        exprTime: expiry,
                        user: {
                            connect: {
                                email: user.email
                            }
                        }
                    }
                })
            }

            //. Set the cookie with the access token for admin
            res.cookie('authToken', accessToken, {
                // domain: "localhost:5000",
                path: "/user",
                httpOnly: true,
                secure: false,
                expires: cookieExpr
            });

            res.json({ "message": "successful login" });
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

        //. Comparing the password with hashed value
        const check = await bcrypt.compare(req.body.password, admin.password);

        if (check) {
            //. generate auth token
            const accessToken = genAuthToken(admin.id);

            if (accessToken) {
                //. Token creation
                await prisma.token.create({
                    data: {
                        authToken: accessToken,
                        valid: true,
                        exprTime: expiry,
                        admin: {
                            connect: {
                                email: admin.email
                            }
                        }
                    }
                })
            }

            //. Set the cookie with the access token for admin
            res.cookie('authToken', accessToken, {
                // domain: "localhost:5000",
                path: "/admin",
                httpOnly: true,
                secure: false,
                expires: cookieExpr
            });

            res.json({ "message": "successful login" });
        }
        else {
            res.json({"message": "Wrong combination"});
        }
    } catch (error) {
        console.log(error);
    }
})

export default router