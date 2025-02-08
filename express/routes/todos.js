const express = require("express");
const router = express.Router();
const helpers = require("../helpers");

router.get("/", (req, res) => {
    const { query } = req.query;

    if (query) {
        console.log(query);
        if (query) {
            const filteredTodos = helpers.list(query);
            res.json(filteredTodos);
        }
    } else {
        const todos = helpers.list("");
        res.json(todos);
    }

});

router.get("/:id", (req, res) => {
    const todo = helpers.getTodoById(req.params.id);
    res.json(todo);
});

router.post("/", (req, res) => {
    console.log(req.body);
    const todo = helpers.addTodo(req.body);
    res.json(todo);
});

router.put("/:id", (req, res) => {
    const todoId = req.params.id;
    console.log(todoId);
    const toBeEditTodo = req.body;

    helpers.edit(toBeEditTodo, todoId);
    res.json({
        status: "Ok",
        message: "Edited Scucessfully",
    });
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    helpers.deleteTask(id);
    res.json({
        status: "Ok",
        message: "Deleted Scucessfully",
    });
});

module.exports = router;