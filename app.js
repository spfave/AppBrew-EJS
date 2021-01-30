require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");


// 
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// 
let todos = ["Get snacks", "start TV", "Binge"];

app.get("/", (req, res) => {
    let today = new Date();
    let day = getDate(today);

    res.render("list", { kindOfDay: day, newToDos: todos });
});

app.post("/", (req, res) => {
    let newToDo = req.body.newToDo;
    todos.push(newToDo);

    res.redirect("/");
});


app.listen(process.env.port, () => {
    console.log(`Server running on port: ${process.env.port}`);
});

function getDate(date) {
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return date.toLocaleDateString("en-US", options);
}
