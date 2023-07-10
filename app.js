const express = require("express");
const cookieParser = require("cookie-parser");
const { Server } = require("http"); // 모듈 불러오기

const goodsRouter = require("./routes/goods.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const connect = require("./schemas");

const app = express();
const http = Server(app); // express app을 http 서버로 감싸기

connect(); // mongoose를 연결합니다.

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));
app.use("/api", [goodsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = http;
