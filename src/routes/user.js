import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router();
const prisma = new PrismaClient();

//! Get available books
router.get("/all_books", async () => {
    try {
        const list = await prisma.booklist.findMany();
        res.json(list);
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console" });
    }
})

//! Request for book
router.post("/ask/:id", async (req, res) => {
    const { id } = req.params;
    try {
        /// Fetching the book
        const book = await prisma.booklist.findUnique({
            where: {
                id
            }
        })

        /// Creating book document
        if (book) {
            const userBook = await prisma.book.create({
                data: {
                    title: book.title,
                    author: book.author,
                    status: "Pending",
                    userID: req.user
                }
            });
            res.json({ userBook });
        }
        else {
            console.log("Failed to add :(");
            res.end();
        }

    } catch (error) {
        console.log(error);
        res.send("error: See console");
    }
})

//! Get the list of issued books
router.get("/issued", async (req, res) => {
    try {
        const issuedBooks = await prisma.book.findMany({
            where:{
                status: "Issued",
                userID: req.user
            }
        })
        res.json(issuedBooks);
    } catch (error) {
        console.log(error);
        res.josn({"error": "see console"});
    }
})

//! See profile
router.get("/profile", async (req, res) => {
    try {
        const userProfile = await prisma.user.findUnique({
            where:{
                id: req.user
            },
            include:{
                email: true,
                username: true,
                contact: true,
                name: true,
                idCard: true,
            }
        })
        res.json(userProfile)
    } catch (error) {
        console.error(error);
        res.json({"error": "see console"});
    }
})
router.put("/verify")

export default router