require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");


// 
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// 
app.get("/", (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();
    let day = getWeekDay(currentDay);

    res.render("list", { kindOfDay: day });
});


app.listen(process.env.port, () => {
    console.log(`Server running on port: ${process.env.port}`);
});


function getWeekDay(weekDayNum) {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekDays[weekDayNum];
}