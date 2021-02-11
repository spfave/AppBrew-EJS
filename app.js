require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const lodash = require("lodash");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date");

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
mongoose.set("useFindAndModify", false);

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your todo list" });
const item2 = new Item({ name: "Use the + button to add a new todo item" });
const item3 = new Item({ name: "<-- check this to mark a todo complete" });
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

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
        // const day = date.getDate();
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    }
  });
});

app.get("/:customItemList", (req, res) => {
  const customItemList = req.params.customItemList;

  List.findOne({ name: customItemList }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create new list
        const list = new List({
          name: customItemList,
          items: defaultItems,
        });
        list.save();
        res.redirect(`/${customItemList}`);
      } else {
        // Show existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.listName;

  const newItem = new Item({ name: itemName });

  if (listName === "Today") {
    // Today todo list
    newItem.save();
    res.redirect("/");
  } else {
    // Custom todo list
    List.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        console.log("test test testing");
        foundList.items.push(newItem);
        foundList.save();
        res.redirect(`/${listName}`);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemID, (err) => {
    if (!err) {
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.port, () => {
  console.log(`Server running on port: ${process.env.port}`);
});
