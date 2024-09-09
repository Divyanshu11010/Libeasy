import { Router } from "express"
import prisma from "../utils/prismaClient.js";

const router = Router();

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
            const reqBook = await prisma.book.create({
                data: {
                    title: book.title,
                    author: book.author,
                    status: "Pending",
                    userID: req.user
                },
            });

            /// notification push
            const admin = await prisma.admin.findUnique({
                where: {
                    type: "librarian"
                }
            });
            if (admin.length === 0) {
                throw new Error("No admins found");
            }
            const adminId = admin.id;

            // notification content
            const content = {
                message: "Issue request pending",
                title: book.title,
            }

            await prisma.notification.create({
                data: {
                    // admin recipient
                    type: "REQUEST",
                    recptType: "ADMIN",
                    content: content,
                    userID: req.user,
                    adminID: adminId,
                    bookID: reqBook.id
                }
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

//! Get all notifications
router.get("/notification", async (req, res) => {
    try {
        let ntfs = await prisma.notification.findMany({
            where: {
                recptType: "USER",
                userID: req.user
            },
            select: {
                content: true,
                date: true,
                book: {
                    select: {
                        status: true
                    }
                }
            },
        })

        res.status(201).json(ntfs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//! To delete read notification for user
router.delete("/notification/:id", async (req, res) => {
    const ntfId = req.params.id;
    try {
        await prisma.notification.delete({
            where: {
                id: ntfId
            }
        })
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router