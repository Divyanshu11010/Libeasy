import prisma from "../utils/prismaClient.js";

const officeMail = process.env.officeMail

async function verification(email, otp) {
    try {
        const otpObj = await prisma.otp.findUnique({
            where: {
                email,
            }
        })

        if (otpObj) {
            if (otpObj.validity > new Date() && !otpObj.used && otpObj.otp === otp) {
                await prisma.otp.deleteMany({
                    where: {
                        email
                    },
                })
                return true;
            }
            else return false;
        }
        return false

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const verifyEmail = async (req, res, next) => {
    try {
        if (req.query.type === "user") {
            const bodyOTP = req.body.otp;
            const email = req.body.email;
            const emailValidity = await verification(email, bodyOTP);
            if (emailValidity) {
                next();
            } else {
                return res.json({ error: "Please, verify email first" })
            }
        } else {
            // admin(office) verification
            const { adminOTP } = req.body;
            const officeValidity = await verification(officeMail, adminOTP);
            if (!officeValidity) {
                return res.json({ error: "Please, verify your admin identity" })
            }

            // admin mail verification
            const { otp } = req.body;
            const email = req.body.email
            const emailValidity = await verification(email, otp);
            if (emailValidity) {
                next();
            } else {
                return res.json({ error: "Please, verify email first and resend otp" })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}