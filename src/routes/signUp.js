import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

//! User sign up
router.post("/user", async (req, res) => {
    const { email, contact, username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email: email, username: username} });
        if (!user) {
            // User creation
            await prisma.user.create({
                data: {
                    email,
                    contact,
                    username,
                    password
                }
            })
            
            // Auth token creation 
            await createToken(email);
            
            res.status(200).send("Successfully Created Account");
        }
        else {
            res.json({ "error": "User Already Exists! do login" });
        }
    } catch (error) {
        console.log(error);
    }
})

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
                    password
                }
            })
            res.status(200).send("Successfully created");
        }
        else {
            res.status(401).json({ "error": "Admin already exits" });
        }
    } catch (error) {
        console.log(error);
    }
})

export default router