const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const productsRouter = require('./routes/products');
const helpers = require("./helpers");
const cors = require("cors");

helpers.createFileIfNotExist();
app.listen(port, (err) => {
    if (!err) {
        console.log(`Server running on port ${port}`);
    } else {
        console.log(err);
    }
});

app.use("/", (req, res, next) => {
    console.log("middleware");
    next();
});

app.use(express.json());
app.use(cors()); // Allow all origins

app.use("/products", productsRouter);
