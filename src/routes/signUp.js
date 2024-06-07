import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

//! User sign up
router.post("/user", async (req, res) => {
    const { email, contact, username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email, username: username } });
        if (!user) {
            // User creation
            await prisma.user.create({
                data: {
                    email,
                    contact,
                    username,
                    password,
                    lastVisit: new Date()
                }
            })

            res.status(200).json({ "message": "Account created" });
        }
        else {
            res.json({ "error": "User Already Exists! do login" });
        }
    } catch (error) {
        console.log(error);
        res.end("error: see console");
    }
})

//! admin sign up
router.post("/admin", async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                email,
            }
        })
        if (!admin) {
            await prisma.admin.create({
                data: {
                    email,
                    username,
                    password,
                    lastVisit: new Date()
                }
            })
            res.status(200).json({ "message": "Account created" });
        }
        else {
            res.status(401).json({ "error": "Admin already exits" });
        }
    } catch (error) {
        console.log(error);
    }
})

export default router