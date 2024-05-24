import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router();
const prisma = new PrismaClient();

router.put(":id/update", async (req, res) => {
    const { id } = req.params;
    const {contact, name, idCard} = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where:{
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

export default router