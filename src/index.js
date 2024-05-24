import express from "express";
import user from "./routes/user.js";

//. For sign up
import signUp from "./routes/signUp.js";
import {encryption} from "../src/middlewares/encryption.js"

//. For login
import login from "./routes/login.js";

const app = express();

app.use(express.json());

app.use("/signup", encryption, signUp);
app.use("/login", login);
app.use("/user", user);

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
});
