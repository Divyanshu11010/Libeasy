import express from "express";
import user from "./routes/user.js";
import admin from "./routes/admin.js";

//. For sign up
import signUp from "./routes/signUp.js";
import {encryption} from "../src/middlewares/encryption.js"

//. For login
import login from "./routes/login.js";

//. For verification
import { verifyToken } from "./middlewares/verifyToken.js";

//. Body parser
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use("/signup", encryption, signUp);
app.use("/login", login);
app.use("/user", verifyToken, user);
app.use("/admin", verifyToken, admin);
// app.use("/forgot", reset);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});
