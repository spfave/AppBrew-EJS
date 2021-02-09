require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date");

//
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database
mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your todo list" });
const item2 = new Item({ name: "Use the + button to add a new todo item" });
const item3 = new Item({ name: "<-- check this to mark a todo complete" });
const defaultItems = [item1, item2, item3];

// const items = ["Get snacks", "start TV", "Binge"];
// const workItems = [];

// Routes
app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Success saved default todo to database");
          }
        });
        res.redirect("/");
      } else {
        const day = date.getDate();
        res.render("list", { listTitle: day, newListItems: foundItems });
      }
    }
  });
});

app.post("/", (req, res) => {
  const newItem = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(newItem);
    res.redirect("/work");
  } else {
    items.push(newItem);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.port, () => {
  console.log(`Server running on port: ${process.env.port}`);
});
