import prisma from "../utils/prismaClient.js";
import { Router } from "express";

import { sendMail } from "../services/sendMail.js";
import { genOTP } from "../utils/genOTP.js";

const OTP_EXPR = process.env.OTP_EXPR || 10;
const officeMail = process.env.officeMail

const router = Router();

//! Helper function to generate and store OTP
const createAndSendOTP = async (email) => {
    const otp = genOTP();
    const validity = new Date(
        new Date().getTime() + OTP_EXPR * 60 * 1000
    );
    if (otp) {
        // first delete all previous otps
        await prisma.otp.deleteMany({
            where:{
                email,
            }
        })

        // save new otp
        await prisma.otp.create({
            data: {
                email,
                otp,
                validity
            }
        });
        await sendMail(email, otp);
    }
};

//! Sending OTP
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

        if (req.query.type === "admin") {
            // OTP sent to office email
            await createAndSendOTP(officeMail);

            // OTP sent to entered email
            await createAndSendOTP(email);
        } else {
            // OTP for user
            await createAndSendOTP(email);
        }

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router
