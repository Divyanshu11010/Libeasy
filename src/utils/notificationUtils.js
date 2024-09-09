import prisma from "./prismaClient.js"

const deleteNotification = async (id) => {
    await prisma.notification.deleteMany({
        where: {
            bookID: id
        }
    })
}

export { deleteNotification };