import bcrypt from "bcrypt"

const saltRounds = 10;

export async function encryption(req, res, next) {
    try {
        const hash = await bcrypt.hash(req.body.password, saltRounds);  // Hashing the password

        // Adding the hashed password into the request object
        req.body.password = hash;
        
        next();
    } catch (error) {
        console.log(error);
    }
}