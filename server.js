const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);

const { getIo, onConnection } = require("./src/server/socketHandlers");

const io = getIo(http);

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on("connection", onConnection);

http.listen(port, function () {
  console.log(`listening on ${port}`);
});
