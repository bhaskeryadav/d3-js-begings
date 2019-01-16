const express = require("express");
const app = express();

app.use((req, res, next) => {
  // console.log(`resquested for: ${req.originalUrl}`);
  next();
});

app.use(express.static(__dirname + "/"));

app.all("*", (req, res) => {
  // console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
  res.status(200).sendFile(__dirname + "/" + "index.html");
});

app.listen(process.env.PORT || 9090);
