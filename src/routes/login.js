import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import genAuthToken from "../utils/genAuthToken.js";
import expiry from "../utils/expiry.js";

const prisma = new PrismaClient;
const router = new Router();

//! User login
router.post("/user", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        })

        /// Comparing the db password with entered password
        if (!user) {
            res.json({ "error": "Unauthorized access" });
        }
        const check = await bcrypt.compare(req.body.password, user.password);

        if (check) {

            /// generating access token
            const accessToken = genAuthToken(user.id);

            /// creating token object in db
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

                console.log("Now you can do login without pass");
            }

            res.send("Successful Login");
        }
        else {
            res.json({ "error:": "Wrong Combination" });
        }
    } catch (error) {
        console.log(error);
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

        /// Comparing the password with hashed value
        const check = await bcrypt.compare(req.body.password, admin.password);

        if (check) {
            /// generate auth token
            const accessToken = genAuthToken(admin.id);

            if (accessToken) {
                /// Token creation
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
                console.log("Now there is no need of password :)");
            }
            res.send("Successful Login");
        }
        else {
            res.send("Entered combination is wrong");
        }
    } catch (error) {
        console.log(error);
    }
})

export default router