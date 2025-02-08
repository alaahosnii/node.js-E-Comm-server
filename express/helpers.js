const fs = require("fs");
const { title } = require("process");
// if (fs.existsSync("./todos.json")) {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
// }

const addTodo = (todo) => {
    const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

    todo.id = todos.length == 0 ? 1 : todos[todos.length - 1].id + 1;
    todo.checked = false;
    todos.push(todo);
    fs.writeFileSync("./todos.json", JSON.stringify(todos));
    return todo;
};

const getTodoById = (id) => {
    const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
    const todo = todos.find((todo) => todo.id == id);
    return todo;
};

const createFileIfNotExist = () => {
    if (!fs.existsSync("./todos.json")) {
        fs.writeFileSync("./todos.json", JSON.stringify([]));
    }
};

const writeTodos = (todos) => {
    fs.writeFileSync("./todos.json", JSON.stringify(todos));
};

const edit = (editedTodo, todoId) => {
    const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

    const newArray = todos.map((todo) => todo.id == todoId ? { ...todo, ...editedTodo } : todo);
    console.log(newArray);

    writeTodos(newArray);
    return editedTodo;

};

const deleteTask = (todoId) => {
    const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
    const filteredTasks = todos.filter((todo) => todo.id != todoId);
    writeTodos(filteredTasks);
    return filteredTasks;
};

const checkTask = (todoId) => {
    const updatedTodos = todos.reduce((acc, todo) => {
        if (todo.id == todoId) {
            todo.checked = true;
        }
        return acc;
    }, todos);

    writeTodos(updatedTodos);
}

const unCheckTask = (todoId) => {
    const updatedTodos = todos.reduce((acc, todo) => {
        if (todo.id == todoId) {
            todo.checked = false;
        }
        return acc;
    }, todos);

    writeTodos(updatedTodos);
}

const list = (query) => {
    const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

    switch (query) {
        case "":
            return JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
        case "all":
            return JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

        case "checked":
            const checkedTodos = todos.filter((todo) => todo.checked == true);
            return checkedTodos;

        case "unchecked":
            const unCheckedTodos = todos.filter((todo) => todo.checked == false);
            return unCheckedTodos;

        default:
            break;
    }
}


module.exports = { addTodo, edit, createFileIfNotExist, getTodoById, deleteTask, checkTask, unCheckTask, list };