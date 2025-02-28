import express from "express";
import { getFavoriteProducts, getFlashSales, getNewArrivals, getProductById, getProducts, getRelatedProducts, insertFavoritesPorducts, insertFlashSales, insertPorducts } from "../helpers/index.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

router.get("/related/:id", async (req, res) => {
    const products = await getRelatedProducts(req.params.id);
    res.json(products);
})
router.get("/:id", async (req, res) => {
    const product = await getProductById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong",
        });
    }
});

router.get("/newarrivals/:category", async (req, res) => {
    const products = await getNewArrivals(req.params.category);
    if (products && products.length > 0) {
        res.json({
            products: products,
        });
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong",
        });
    }
});

router.post("/", async (req, res) => {
    const body = req.body;
    await insertPorducts(body);
    res.json({
        status: true,
        message: "Products Added Scucessfully",
    });
});

router.post("/favorites", async (req, res) => {
    const body = req.body;
    await insertFavoritesPorducts(body);
    res.json({
        status: true,
        message: "Favorites Added Scucessfully",
    });
});

router.get("/favorites", async (req, res) => {
    const favorites = await getFavoriteProducts();
    if (favorites) {
        if (favorites.length == 0) {
            res.status(400).json({
                status: false,
                products: []
            });
            return;
        }
        res.status(200).json({
            status: true,
            products: favorites
        });
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong",
        });
    }
});



router.get("/flashsales", async (req, res) => {
    const flashSales = await getFlashSales();
    if (flashSales && flashSales.length > 0) {
        res.json(flashSales);
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong",
        });
    }
});

router.put("/:id", (req, res) => {
    const todoId = req.params.id;
    console.log(todoId);
    const toBeEditTodo = req.body;

    edit(toBeEditTodo, todoId);
    res.json({
        status: true,
        message: "Edited Scucessfully",
    });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    deleteTask(id);
    res.json({
        status: true,
        message: "Deleted Scucessfully",
    });
});

// router.post("/flashsales", async (req, res) => {
//     const body = req.body;
//     const flashSales = await insertFlashSales(body);
//     if (flashSales) {
//         res.status(201).json({
//             status: true,
//             message: "Flash Sales Updated Scucessfully",
//         });
//     } else {
//         res.status(400).json({
//             status: false,
//             message: "Something went wrong",
//         });
//     }
// });

export default router;