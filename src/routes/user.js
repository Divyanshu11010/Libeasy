import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router();
const prisma = new PrismaClient();

//! Get available books
router.get("/all_books", async (req, res) => {
    try {
        const list = await prisma.booklist.findMany({
            select: {
                cover: true,
                title: true,
                author: true,
                ISBN: true,
                details: true
            }
        });
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
            await prisma.book.create({
                data: {
                    title: book.title,
                    author: book.author,
                    status: "Pending",
                    userID: req.user
                },
            });
            res.json({ "message": "request submitted" });
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
            where: {
                status: "Issued",
                userID: req.user
            },
            select: {
                title: true,
                author: true,
                returnDate: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        contact: true
                    }
                }
            }
        })
        res.json(issuedBooks);
    } catch (error) {
        console.log(error);
        res.josn({ "error": "see console" });
    }
})

//! See profile
router.get("/profile", async (req, res) => {
    try {
        const userProfile = await prisma.user.findUnique({
            where: {
                id: req.user
            },
            select: {
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
        res.json({ "error": "see console" });
    }
})

//! update profile
router.put("/profile", async (req, res) => {
    const { contact, name, idCard } = req.body
    try {
        await prisma.user.update({
            data: {
                contact,
                name,
                idCard,
            },
            where: {
                id: req.user
            }
        })
        res.json({ "message": "successfully updated" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! Logout
router.delete("/logout", async (req, res) => {
    try {
        await prisma.token.deleteMany({
            where: {
                userID: req.user
            }
        })
        res.json({ "message": "logout successful" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

router.put("/verify")

export default router