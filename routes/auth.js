import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { userIsExist, addUser, refreshToken, getUsers, generateToken, updateUser } from "../helpers/index.js";

router.post("/register", async (req, res) => {
    const user = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const updatedUser = {
        ...user,
        password: hashedPassword
    }
    if (user) {
        if (await userIsExist(updatedUser)) {
            res.status(400).json({
                status: false,
                message: "User Already Exists",
            });
            return;
        }

        await addUser(updatedUser);
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
    console.log("userrrrr" , user);
    delete user.password , user.cart , user.favorites , _id , user.iat , user.exp;
    
    const result = await userIsExist(user);
    if (result) {
        const updatedUser = req.body;
        console.log("user", updatedUser);

        const isUpdated = await updateUser(updatedUser, user);
        if (isUpdated) {
            const newToken = generateToken({
                ...user,
                ...updatedUser,
            });
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
        const isPasswordMatch = await bcrypt.compare(userBody.password, userFound.password);
        if (isPasswordMatch) {
            const token = generateToken(userFound);
            res.status(201).json({
                status: "Ok",
                message: "User Logged In Scucessfully",
                user: {
                    id: userFound._id,
                    name: userFound.name,
                    email: userFound.email,
                    password: userBody.password
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
            message: "User Not Found",
        });
    }
});

export default router;