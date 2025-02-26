import express from "express";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createFileIfNotExist } from "./helpers/index.js";
import client from "./mongoDbClient/index.js";
import dotenv from "dotenv";
dotenv.config();  // Load environment variables

const app = express();

const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'secret'; // Use environment variables in production
app.use(express.json());
app.use(cors()); // Allow all origins


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        console.log("connecting");

        await client.connect();
        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // await insertPorducts();
    } catch (error) {
        console.log(error);
    }
}



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token && req.path !== "/login" && req.path !== "/register") return res.status(401).json({
        status: "Error",
        message: "Unauthorized"
    });

    try {
        if (req.path === "/refreshToken") {
            console.log("refresh");

            const decodedUser = jwt.decode(token, SECRET_KEY);
            req.user = decodedUser;
            console.log(decodedUser);

            return next();
        } else if (req.path === "/login" || req.path === "/register") {
            return next();
        }
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            return res.status(401).json({
                status: false,
                message: "Token Expired"
            });
        } else if (error.name == "JsonWebTokenError") {
            return res.status(403).json({
                status: false,
                message: "Invalid Token"
            });
        } else {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error"
            });
        }
    }
};
app.use("/auth", authenticateToken);
app.use("/user", authenticateToken);

app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port ${port}`);
    } else {
        console.log(err);
    }
});



// app.use("/products", authenticateToken);


await run();
// await insertPorducts();
app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

// export default app;
