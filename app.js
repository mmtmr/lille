"use strict";
var rp = require("request-promise");
const express = require("express");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const compression = require('compression');

app.use(compression());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(express.json());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/dist'));
}
app.use(express.static('dist'));

//Routes
app.use("/auth/jwt", require("./routes/jwtAuth"))
app.use("/auth/google", require("./routes/googleAuth"))

app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/timetable", require("./routes/timetable"));
app.use("/api/option", require("./routes/option"));

app.use("/api/task", require("./routes/task"));
app.use("/api/timelog", require("./routes/timelog"));
app.use("/api/notionLog", require("./routes/notionLog"));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));