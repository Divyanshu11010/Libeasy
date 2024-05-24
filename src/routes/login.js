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

        // Comparing the db password with entered password
        const check = await bcrypt.compare(req.body.password, user.password);

        if (check) {

            /// creating token object in db
            const token = await prisma.token.create(
                {
                    data: {
                        valid: false,
                        exprTime: null,
                        user: {
                            connect: {
                                where: {
                                    email: user.email
                                }
                            }
                        }
                    }
                }
            )

            /// generating access token
            let accessToken;
            if (token) {
                accessToken = genAuthToken(token.id);
            }

            /// updating token object with authToken, exprTime, valid
            if (accessToken) {
                await prisma.token.update({
                    data: {
                        authToken: accessToken,
                        exprTime: expiry,
                        valid: true,
                    }
                })
                console.log(token);
                console.log("Now you can do login without pass");
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

//! Admin login
router.post("/admin", async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                username: req.body.username,
            }
        })
        const check = await bcrypt.compare(req.body.password, admin.password);

        if (check) {
            res.send("Successful Login");
            await createToken(email);
        }
        else {
            res.send("Entered combination is wrong");
        }
    } catch (error) {
        console.log(error);
    }
})

export default router