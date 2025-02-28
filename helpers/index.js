import fs from "fs";
import jwt from "jsonwebtoken";
import client from "../mongoDbClient/index.js";
const SECRET_KEY = process.env.JWT_SECRET || 'secret'; // Use environment variables in production

// if (fs.existsSync("./todos.json")) {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
// }

// const addTodo = (todo) => {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

//     todo.id = todos.length == 0 ? 1 : todos[todos.length - 1].id + 1;
//     todo.checked = false;
//     todos.push(todo);
//     fs.writeFileSync("./todos.json", JSON.stringify(todos));
//     return todo;
// };

export const addUser = async (userObj) => {
    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    await usersCollection.insertOne(userObj);
    // const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

    // userObj.id = users.length == 0 ? 1 : users[users.length - 1].id + 1;
    // users.push(userObj);
    // fs.writeFileSync("./users.json", JSON.stringify(users));
};

export const addCartToUser = async (user) => {

    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    await usersCollection.updateOne(
        { email: user.email },
        {
            $set: {
                cart: user.cart
            }
        }
    );
}

export const getUserCart = async (email) => {
    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    const cart = await usersCollection.findOne({
        email: email
    }, {
        projection: {
            _id: 0,
            cart: 1
        }
    });
    // console.log(cart);

    return cart;
}

export const userIsExist = async (userObj) => {
    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    const userFound = await usersCollection.findOne({
        email: userObj.email
    });
    console.log(userFound);
    return userFound;
    // const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
    // const userFound = users.find(user => user.email == userObj.email);
    // return userFound;
}

export const updateUser = async (updatedUser, currentUser) => {
    console.log("userObj", updatedUser);

    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    const result = await usersCollection.updateOne(
        { email: currentUser.email },
        {
            $set: {
                ...updatedUser
            }
        }
    );
    if (result.modifiedCount == 1) {
        return true;
    } else {
        return false;
    }
}
export const getProductById = async (id) => {
    // const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
    // const product = products.find((product) => product.id == id);

    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("products");
    console.log(id);

    const product = await productsCollection.findOne({
        id: parseInt(id)
    });

    // console.log(product);

    return product;
};

export const getRelatedProducts = async (id) => {
    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("products");
    const item = await getProductById(id);
    const products = await productsCollection.find({
        category: item.category
    }).toArray();
    // console.log(products);

    // const relatedProducts = products.filter((product) => product.category == item.category);
    return products;
}

export const insertFlashSales = async (flashSales) => {
    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("sales");
    return await productsCollection.insertMany(flashSales);
}
export const insertPorducts = async (products) => {
    try {
        const myDB = client.db("E-Commerce");
        const productsCollection = myDB.collection("products");
        return await productsCollection.insertMany(products);
    } catch (error) {
        console.log(error);

    }
}

export const insertFavoritesPorducts = async (products , user) => {
    try {
        const myDB = client.db("E-Commerce");
        const usersCollection = myDB.collection("users");
        await usersCollection.updateOne(
            { email: user.email },
            {
                $set: {
                    favorites: products
                }
            }
        );
    } catch (error) {
        console.log(error);

    }
}

export const getNewArrivals = async (category) => {
    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("new arrivals");
    const products = await productsCollection.find({
        category: category
    }).toArray();
    return products;
}
export const getFlashSales = async () => {
    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("products");
    const products = await productsCollection.find({
        flashSales: true
    }).toArray();
    return products;
}
export const createFileIfNotExist = () => {
    console.log("create");

    if (!fs.existsSync("./products.json")) {
        console.log("not");

        fs.writeFileSync("./products.json", JSON.stringify([]));
    }
    if (!fs.existsSync("./users.json")) {
        fs.writeFileSync("./users.json", JSON.stringify([]));
    }
};

// const writeTodos = (todos) => {
//     fs.writeFileSync("./products.json", JSON.stringify(todos));
// };

// const edit = (editedTodo, todoId) => {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

//     const newArray = todos.map((todo) => todo.id == todoId ? { ...todo, ...editedTodo } : todo);
//     console.log(newArray);

//     writeTodos(newArray);
//     return editedTodo;

// };

// const deleteTask = (todoId) => {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
//     const filteredTasks = todos.filter((todo) => todo.id != todoId);
//     writeTodos(filteredTasks);
//     return filteredTasks;
// };

// const checkTask = (todoId) => {
//     const updatedTodos = todos.reduce((acc, todo) => {
//         if (todo.id == todoId) {
//             todo.checked = true;
//         }
//         return acc;
//     }, todos);

//     writeTodos(updatedTodos);
// }

// const unCheckTask = (todoId) => {
//     const updatedTodos = todos.reduce((acc, todo) => {
//         if (todo.id == todoId) {
//             todo.checked = false;
//         }
//         return acc;
//     }, todos);

//     writeTodos(updatedTodos);
// }

export const getProducts = async () => {
    const myDb = client.db("E-Commerce");
    const productsCollection = myDb.collection("products");
    const products = await productsCollection.find({}).toArray();

    return products;
    // return JSON.parse(fs.readFileSync("./products.json", "utf-8"));

}

export const getFavoriteProducts = async (email) => {
    const myDB = client.db("E-Commerce");
    const usersCollection = myDB.collection("users");
    const favorites = await usersCollection.findOne({
        email: email
    }, {
        projection: {
            _id: 0,
            favorites: 1
        }
    });
    // console.log(cart);

    return favorites;
}

export const generateToken = (user) => {
    let token;
    token = jwt.sign(user, SECRET_KEY, {
        expiresIn: "1h"
    });
    return token;
}

export const refreshToken = (user) => {
    const payload = {
        name: user.name,
        email: user.email,
        password: user.password
    };
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1h"
    });
}

export const decryptToken = (token) => {
    try {
        const decodedUser = jwt.verify(token, SECRET_KEY);
        return {
            status: true,
            user: {
                name: decodedUser.name,
                email: decodedUser.email,
                id: decodedUser.id
            }
        };

    } catch (error) {
        return {
            status: false,
            message: "Invalid Token"
        }
    }
}
export const getUsers = () => {
    return JSON.parse(fs.readFileSync("./users.json", "utf-8"));
}
// const list = (query) => {
//     const todos = JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

//     switch (query) {
//         case "":
//             return JSON.parse(fs.readFileSync("./todos.json", "utf-8"));
//         case "all":
//             return JSON.parse(fs.readFileSync("./todos.json", "utf-8"));

//         case "checked":
//             const checkedTodos = todos.filter((todo) => todo.checked == true);
//             return checkedTodos;

//         case "unchecked":
//             const unCheckedTodos = todos.filter((todo) => todo.checked == false);
//             return unCheckedTodos;

//         default:
//             break;
//     }
// }


// module.exports = { getProducts , getRelatedProducts, refreshToken, decryptToken, userIsExist, getProductById, addUser, createFileIfNotExist, getUsers, generateToken };