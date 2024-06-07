import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

//! Add book in the library
router.post("/add_book", async (req, res) => {
    const { title, author, ISBN, details } = req.body;
    try {
        const book = await prisma.booklist.create({
            data: {
                title,
                author,
                ISBN,
                details
            },
            select: {
                cover: true,
                title: true,
                author: true,
                ISBN: true,
                details: true
            }
        });
        res.json(book);
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console" });
    }
})

//! Delete book in the library
router.delete("/remove_book/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.booklist.delete({
            where: {
                id
            }
        });
        res.json({ "message": "successfully deleted" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "See console" });
    }
})

//! Get the list of all books
router.get("/all_books", async (req, res) => {
    try {
        const books = await prisma.booklist.findMany({
            select: {
                cover: true,
                title: true,
                author: true,
                ISBN: true,
                details: true
            }
        });
        if (!books) {
            res.json({ "message": "No books" });
        }
        res.json(books);
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! Get the list of all issued books
router.get("/issued_books", async (req, res) => {
    try {
        const books = await prisma.book.findMany({
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
        });
        if (!books) {
            res.json({ "message": "No books" });
        }
        res.json(books);
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! Get the list of users
router.get("/user_list", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                contact: true,
                idCard: true
            }
        });
        if (!users) {
            res.json({ "message": "No users" });
        }
        res.json(users);
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! Accept the return of books
router.delete("/return/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.book.delete({
            where: {
                id: id
            }
        })
        res.json({ "message": "return accepted" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! See all the requests
router.get("/requests", async (req, res) => {
    try {
        const requests = await prisma.book.findMany({
            where: {
                status: "Pending"
            },
            select: {
                title: true,
                author: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        contact: true
                    }
                }
            }
        });
        res.json(requests);
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

//! Issue requested book
router.put("/issue/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.book.update({
            data: {
                status: "Issued",
                returnDate: new Date()
            },
            where: {
                id: id
            }
        })
        res.json({ "message": "successfully issued" });
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
                userID: req.admin
            }
        })
        res.json({ "message": "logout successful" });
    } catch (error) {
        console.log(error);
        res.json({ "error": "see console" });
    }
})

export default router;