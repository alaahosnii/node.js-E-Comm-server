import express from "express";
const router = express.Router();
import { userIsExist, addUser, refreshToken, getUsers, generateToken } from "../helpers/index.js";

router.post("/register", async(req, res) => {
    const user = req.body;

    if (user) {
        if (await userIsExist(user)) {
            res.status(400).json({
                status: false,
                message: "User Already Exists",
            });
            return;
        }

        await addUser(user);
        res.status(201).json({
            status: true,
            message: "User Registered Scucessfully",
        });
    } else {
        res.status(400).json({
            status: false,
            message: "Please provide user details",
        });
    }
});

router.get("/loggedInUser", (req, res) => {
    let user = req.user;
    // let token = req.headers.authorization;
    // token = token.split(" ")[1];

    // const result = helpers.decryptToken(token);

    // if (!result.status) {
    //     res.status(401).json(
    //         result
    //     );
    //     return;
    // }
    console.log(user);
    
    res.status(200).json({
        status: true,
        user: user,
    })
});

router.get("/refreshToken", (req, res) => {
    let user = req.user;
    // let token = req.headers.authorization;
    // token = token.split(" ")[1];
    // const result = helpers.decryptToken(token);
    // if (!result.status) {
    //     res.status(401).json(
    //         result
    //     );
    //     return;
    // }
    const newToken = refreshToken(user);
    res.status(200).json({
        status: true,
        token: newToken,
    })
});

router.post("/login", async(req, res) => {
    const userBody = req.body;
    const userFound = await userIsExist(userBody);
    if (userFound) {
        
        if (userFound.password == userBody.password) {
            const token = generateToken(userFound);
            res.status(201).json({
                status: "Ok",
                message: "User Logged In Scucessfully",
                user: {
                    name: userFound.name,
                    email: userFound.email,
                },
                token: token,
            });
        } else {
            res.status(400).json({
                status: "Error",
                message: "Invalid Password",
            });
        }
    } else {
        res.status(400).json({
            status: "Error",
            message: "Invalid Email",
        });
    }
});

export default router;