import express from "express";
import user from "./routes/user.js";
import admin from "./routes/admin.js";

//. For sign up
import signUp from "./routes/signUp.js";
import { encryption } from "../src/middlewares/encryption.js"

//. For login
import login from "./routes/login.js";

//. For verification
import { verifyUserToken, verifyAdminToken } from "./middlewares/verifyToken.js";

//. Body parser
import bodyParser from "body-parser";

import cookieParser from "cookie-parser";

//. Email verification
import getOTP from "./routes/getOTP.js"
import { verifyEmail } from "./middlewares/verifyEmail.js";

//. To refresh token
import { createUserToken, createAdminToken } from "./middlewares/createToken.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/get-otp", getOTP)
app.use("/signup", verifyEmail, encryption, signUp);
app.use("/login", login);
app.use("/user", verifyUserToken, createUserToken, user);
app.use("/admin", verifyAdminToken, createAdminToken, admin);
// app.use("/forgot", reset);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});
