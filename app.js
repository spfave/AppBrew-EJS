require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");


// 
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// 
const todos = ["Get snacks", "start TV", "Binge"];
const workToDos = [];

app.get("/", (req, res) => {
    let day = date.getDate();
    res.render("list", { listTitle: day, newToDos: todos });
});

app.post("/", (req, res) => {
    let newToDo = req.body.newToDo;

    if (req.body.list === "Work") {
        workToDos.push(newToDo);
        res.redirect("/work");
    } else {
        todos.push(newToDo);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newToDos: workToDos });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(process.env.port, () => {
    console.log(`Server running on port: ${process.env.port}`);
});
