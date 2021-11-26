"use strict";
var rp = require("request-promise");
const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/dist'));
}

//Routes
app.use("/auth",require("./routes/jwtAuth"))
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/apuCourse", require("./routes/apuCourse"));
app.use("/api/work", require("./routes/work"));
app.use("/api/task", require("./routes/task"));
app.use("/api/timelog", require("./routes/timelog"));


app.use(express.static('dist'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
  });

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));