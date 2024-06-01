import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

//! Add book in the library
router.post("/add_books", async (req, res) => {
    const { title, author, ISBN, details } = req.body;
    try {
        const book = await prisma.booklist.create({
            data: {
                title,
                author,
                ISBN,
                details
            }
        });
        res.json(book);
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console" });
    }
})

export default router;