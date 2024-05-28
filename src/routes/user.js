import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router();
const prisma = new PrismaClient();

//! Get available books
router.get("/all_books", async () => {
    try {
        const list = prisma.book.findMany({
            include:{
                userID: false,
                user: false
            }
        });
        console.log(list);
    } catch (error) {
        console.log(error);
        res.json({"error": "See console"});
    }
})

//! adding a book
router.post("/addBook", async (req, res) => {
    const { title, author } = req.body;
    try {
        /// Creating book document
        const book = await prisma.book.create({
            data: {
                title: title,
                author: author,
                user: {
                    connect: {
                        id: req.user
                    }
                }
            }
        })

        if (!book) {
            console.log("Failed to add :(");
            res.end();
        }
        res.json({ book });
    } catch (error) {
        console.log(error);
        res.send("error: See console");
    }
})
router.get("/issued_books")
router.get("/profile")


router.put("/update", async (req, res) => {
    const { id } = req.params;
    const { contact, name, idCard } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                contact,
                name,
                profile,
                idCard
            }
        })
        res.status(200).send(updatedUser);
    } catch (error) {
        console.log(error);
    }
})
router.put("/verify")

export default router