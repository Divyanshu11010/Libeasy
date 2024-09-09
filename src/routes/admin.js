import { Router } from "express";
import prisma from "../utils/prismaClient.js";
import { deleteNotification } from "../utils/notificationUtils.js";
import { overdueTrig } from "../utils/taskSchedulars.js";

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
        const book = await prisma.book.update({
            where: {
                id: id
            },
            data: {
                status: "Returned",
                bookID: null
            }
        })

        await prisma.book.delete({
            where: {
                id: id
            }
        })

        /// delete current pending requests from both sides
        await deleteNotification(id);

        /// notification alert for issue of the book
        const content = {
            title: book.title,
            status: book.status,
            issuedOn: book.updatedAt,
        }

        await prisma.notification.create({
            data: {
                type: "RETURNED",
                content: content,
                recptType: "USER",
                userID: book.userID,
                adminID: req.admin,
                bookID: id
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
const HOLD_PERIOD_DAYS = new Date(Date.now() + 15000);
// const HOLD_PERIOD_DAYS = new Date(Date.now() + process.env.HOLD_PERIOD_DAYS * 24 * 60 * 60 * 1000);

router.put("/issue/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const book = await prisma.book.update({
            data: {
                status: "Issued",
                returnDate: HOLD_PERIOD_DAYS
            },
            where: {
                id: id
            }
        })

        /// delete current pending requests from both sides
        await deleteNotification(id);
        // await prisma.notification.deleteMany({
        //     where: {
        //         bookID: id
        //     }
        // })

        /// notification alert for issue of the book
        const content = {
            title: book.title,
            status: book.status,
            issuedOn: book.updatedAt,
            returnBy: book.returnDate
        }

        await prisma.notification.create({
            data: {
                type: "ISSUE",
                content: content,
                recptType: "USER",
                userID: book.userID,
                adminID: req.admin,
                bookID: id
            }
        })

        overdueTrig(id, book.userID, req.admin);
        res.json({ "message": "successfully issued" });
    } catch (error) {
        console.log(error);
        res.json({ error: "see console" });
    }
})

//! Reject requested books
router.post("/reject/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const book = await prisma.book.update({
            where: {
                id
            },
            data: {
                status: "Rejected"
            }
        })

        /// delete the rejected request
        await prisma.book.deleteMany({
            where: {
                status: "Rejected"
            }
        })

        /// delete the notification 
        await deleteNotification(id);

        /// create new notification
        const content = {
            title: book.title,
            status: book.status,
        }

        await prisma.notification.create({
            data: {
                type: "REJECT",
                content: content,
                recptType: "USER",
                userID: book.userID,
                adminID: req.admin,
                bookID: id
            }
        })

        res.json({ message: "Successfully Rejected" });
    } catch (error) {
        console.log(error);
        res.json({ error: "see console" });
    }
})

//! To get all the notifications admin
router.get("/notification", async (req, res) => {
    try {
        const ntfs = await prisma.notification.findMany({
            where: {
                recptType: "ADMIN",
                adminID: req.admin
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

//! To delete read notification for admin
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