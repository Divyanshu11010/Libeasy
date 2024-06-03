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

//! See all the requests
router.get("/requests", async (req, res) => {
    try {
        const requests = await prisma.book.findMany();
        res.json(requests);
    } catch (error) {
        console.log(error);
        res.json({"error":"see console"});
    }
})

//! Issue requested book
router.put("/issue/:id", async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.book.update({
            data:{
                status: "Issued"
            },
            where:{
                id: id
            }
        })
        res.send("The book is issued to the user successfully");
    } catch (error) {
        console.log(error);
        res.json({"error":"see console"});
    }
})

export default router;