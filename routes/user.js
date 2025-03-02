import express from "express";
const router = express.Router();
import { userIsExist, addUser, refreshToken, getUsers, generateToken, addCartToUser, getUserCart, insertFavoritesPorducts, getFavoriteProducts } from "../helpers/index.js";

// router.post("/register", async(req, res) => {
//     const user = req.body;

//     if (user) {
//         if (await userIsExist(user)) {
//             res.status(400).json({
//                 status: false,
//                 message: "User Already Exists",
//             });
//             return;
//         }

//         await addUser(user);
//         res.status(201).json({
//             status: true,
//             message: "User Registered Scucessfully",
//         });
//     } else {
//         res.status(400).json({
//             status: false,
//             message: "Please provide user details",
//         });
//     }
// });

// router.get("/loggedInUser", (req, res) => {
//     let user = req.user;
//     // let token = req.headers.authorization;
//     // token = token.split(" ")[1];

//     // const result = helpers.decryptToken(token);

//     // if (!result.status) {
//     //     res.status(401).json(
//     //         result
//     //     );
//     //     return;
//     // }
//     console.log(user);

//     res.status(200).json({
//         status: true,
//         user: user,
//     })
// });

// router.get("/refreshToken", (req, res) => {
//     let user = req.user;
//     // let token = req.headers.authorization;
//     // token = token.split(" ")[1];
//     // const result = helpers.decryptToken(token);
//     // if (!result.status) {
//     //     res.status(401).json(
//     //         result
//     //     );
//     //     return;
//     // }
//     const newToken = refreshToken(user);
//     res.status(200).json({
//         status: true,
//         token: newToken,
//     })
// });

router.post("/cart", async (req, res) => {
    const user = req.user;
    const cart = req.body;
    console.log(user);


    user.cart = cart;
    await addCartToUser(user);
    res.status(200).json({
        status: true,
        message: "Cart Updated",
        cart: user.cart
    })
})

router.post("/favorites", async (req, res) => {
    const body = req.body;
    await insertFavoritesPorducts(body , req.user);
    res.json({
        status: true,
        message: "Favorites Added Scucessfully",
    });
});

router.get("/favorites", async (req, res) => {
    const result = await getFavoriteProducts(req.user.email);
    console.log("favorites" , result);
    
    if (result) {
        if (Object.keys(result).length == 0 || result.favorites.length == 0) {
            res.status(200).json({
                status: true,
                products: []
            });
            return;
        }
        res.status(200).json({
            status: true,
            products: result.favorites
        });
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong",
        });
    }
});

router.get("/cart", async (req, res) => {
    const user = req.user;
    console.log("user cart" , user);
    
    const cart = await getUserCart(user.email);
    console.log("carttt");

    Object.keys(cart).length ? res.status(200).json({
        status: true,
        ...cart
    }) : res.status(200).json({
        status: true,
        cart: {
            products: [],
            totalPrice: 0,
            totalQuantity: 0
        }
    });
});

router.get("/login", async (req, res) => {
    const userBody = req.body;
    const userFound = await userIsExist(userBody);
    if (userFound) {
        if (userFound.password == userBody.password) {
            const token = generateToken(userFound);
            res.status(201).json({
                status: "Ok",
                message: "User Logged In Scucessfully",
                user: {
                    userName: userFound.userName,
                    email: userFound.email,
                    id: userFound.id,
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