import express from "express";
const router = express.Router();
import { userIsExist, addUser, refreshToken, getUsers, generateToken, updateUser } from "../helpers/index.js";

router.post("/register", async (req, res) => {
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

router.patch("/updateUser", async (req, res) => {
    const user = req.user;
    const result = await userIsExist(user);
    if (result) {
        const updatedUser = req.body;
        console.log("user", updatedUser);
        
        const isUpdated = await updateUser(updatedUser , user);
        if (isUpdated) {
            const newToken = generateToken(updatedUser);
            res.status(200).json({
                status: true,
                message: "User Updated Successfully",
                user: updatedUser,
                token: newToken,
            });
        } else {
            res.status(400).json({
                status: false,
                message: "User Not Updated",
            });
        }
    } else {
        res.status(400).json({
            status: false,
            message: "User Not Found",
        });
    }
});

router.post("/login", async (req, res) => {
    const userBody = req.body;
    const userFound = await userIsExist(userBody);
    if (userFound) {

        if (userFound.password == userBody.password) {
            const token = generateToken(userFound);
            res.status(201).json({
                status: "Ok",
                message: "User Logged In Scucessfully",
                user: {
                    id: userFound._id,
                    name: userFound.name,
                    email: userFound.email,
                    password: userFound.password
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