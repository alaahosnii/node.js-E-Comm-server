const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const todosRouter = require('./routes/todos');
const helpers = require("./helpers");
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

app.use("/todos", todosRouter);
