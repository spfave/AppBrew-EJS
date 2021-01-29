require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");


// 
app = express();
app.use(bodyParser.urlencoded({ extended: true }));


// 
app.get("/", (req, res) => {
    let today = new Date();
    let currentDay = today.getDay();

    if (currentDay === 6 || currentDay === 0) {
        res.send("Yay its the weekend!");
    } else {
        res.send("Lame its a working day");
    }
});



app.listen(process.env.port, () => {
    console.log(`Server running on port: ${process.env.port}`);
});