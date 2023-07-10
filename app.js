const express = require("express");
const cookieParser = require("cookie-parser");
const { Server } = require("http"); // 1. 모듈 불러오기
const socketIo = require("socket.io"); // 1. 모듈 불러오기

const goodsRouter = require("./routes/goods.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const connect = require("./schemas");

const app = express();
const http = Server(app); // 2. express app을 http 서버로 감싸기
const io = socketIo(http); // 3. http 객체를 Socket.io 모듈에 넘겨서 소켓 핸들러 생성

const port = 3000;

connect(); // mongoose를 연결합니다.

const socketIdMap = {};

function emitSamePageViewerCount() {
  const urls = Object.values(socketIdMap);
  const countByUrl = urls.reduce((value, url) => {
    if (!url) return value; // detail 페이지가 아닌 사용자는 제외
    return {
      ...value,
      [url]: value[url] ? value[url] + 1 : 1,
    };
  }, {});

  for (const [socketId, url] of Object.entries(socketIdMap)) {
    const count = countByUrl[url];
    io.to(socketId).emit("SAME_PAGE_VIEWER_COUNT", count);
  }
}

// 4. 소켓 연결 이벤트 핸들링
io.on("connection", (sock) => {
  socketIdMap[sock.id] = null;
  console.log("새로운 소켓이 연결됐어요!");

  sock.on("CHANGED_PAGE", (data) => {
    console.log("페이지가 바뀌었대요", data, sock.id);
    socketIdMap[sock.id] = data; // 소켓 아이디와 페이지 url을 매핑

    emitSamePageViewerCount();
  });

  sock.on("BUY", (data) => {
    const payload = {
      nickname: data.nickname,
      goodsId: data.goodsId,
      goodsName: data.goodsName,
      date: new Date().toISOString(),
    };

    console.log("클라이언트가 구매한 데이터", data, new Date());
    sock.broadcast.emit("BUY_GOODS", payload);
  });

  sock.on("disconnect", () => {
    delete socketIdMap[sock.id];
    console.log(sock.id, "연결이 끊어졌어요!");
    emitSamePageViewerCount();
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));
app.use("/api", [goodsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 5. app 대신 http 객체로 서버 열기
http.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
