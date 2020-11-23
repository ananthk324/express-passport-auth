const express = require("express");
const expressLayout = require("express-ejs-layouts");

const app = express();

// EJS
app.use(expressLayout);
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port}`));
