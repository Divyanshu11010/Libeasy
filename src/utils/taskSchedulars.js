import prisma from "./prismaClient.js";

const HOLD_PERIOD_DAYS = process.env.HOLD_PERIOD_DAYS * 24 * 60 * 60 * 1000 || 15 * 24 * 60 * 60 * 100
const DAILY_REMINDER_INTERVAL = 24 * 60 * 60 * 1000;

const overdueTrig = (requestId, userID, adminID) => {
    setTimeout(async () => {
        try {
            const book = await prisma.book.update({
                where: {
                    id: requestId
                },
                data: {
                    status: "Overdue"
                }
            })

            console.log(book);
            /// notification alert for issue of the book
            const content = {
                title: book.title,
                status: book.status,
                issuedOn: book.updatedAt,
                returnBy: book.returnDate
            }

            await prisma.notification.create({
                data: {
                    type: "OVERDUE",
                    content: content,
                    recptType: "USER",
                    userID,
                    adminID,
                    bookID: book.id
                }
            })

            scheduleDailyReminder(userID, adminID, book.id, content);
        } catch (error) {
            console.log(error);
        }
    }, HOLD_PERIOD_DAYS);
}

const scheduleDailyReminder = (userID, adminID, bookID, content) => {
    const reminderInterval = setInterval(async () => {
        try {
            const book = await prisma.book.findUnique({
                where: {
                    id: bookID
                }
            });

            // if there is no book document
            if (!book) {
                clearInterval(reminderInterval);
            }
            else if (book.status === "Overdue") {
                // If the book is still overdue, send a daily reminder notification
                await prisma.notification.create({
                    data: {
                        type: "REMINDER",
                        content: content,
                        recptType: "USER",
                        userID,
                        adminID,
                        bookID
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, DAILY_REMINDER_INTERVAL);
};

export { overdueTrig };