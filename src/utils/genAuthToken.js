import jwt from "jsonwebtoken"

const SECRET_KEY = "@localSecret";

//. Function to generate authToken 
function genAuthToken(tokenID) {
    const jwtPayload = { tokenID };
    try {
        const token = jwt.sign(jwtPayload, SECRET_KEY, { algorithm: "HS256", noTimestamp: true });
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default genAuthToken