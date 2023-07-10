const socketIo = require("socket.io"); // 모듈 불러오기
const http = require("./app.js");
const io = socketIo(http); // http 객체를 Socket.io 모듈에 넘겨서 소켓 핸들러 생성

const socketIdMap = {};

function initSocket(sock) {
  socketIdMap[sock.id] = null;
  console.log("새로운 소켓이 연결됐어요!");

  // 특정 이벤트가 전달되었는지 감지할 때 사용될 함수
  function watchEvent(event, func) {
    sock.on(event, func);
  }

  // 연결된 모든 클라이언트에 데이터를 전달하는 함수
  function notifyEveryone(event, data) {
    sock.broadcast.emit(event, data);
  }

  // 특정한 클라이언트에 데이터를 전달하는 함수
  function notifyTo(socketId, event, data) {
    io.to(socketId).emit(event, data);
  }

  // 페이지가 변경되었을 때, 같은 페이지를 본 사용자 수를 전달하는 함수
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
      notifyTo(socketId, "SAME_PAGE_VIEWER_COUNT", count);
    }
  }

  return {
    watchChangePage: () => {
      watchEvent("CHANGED_PAGE", (data) => {
        console.log("페이지가 바뀌었대요", data, sock.id);
        socketIdMap[sock.id] = data; // 소켓 아이디와 페이지 url을 매핑

        emitSamePageViewerCount();
      });
    },

    watchBuying: () => {
      watchEvent("BUY", (data) => {
        const payload = {
          nickname: data.nickname,
          goodsId: data.goodsId,
          goodsName: data.goodsName,
          date: new Date().toISOString(),
        };

        console.log("클라이언트가 구매한 데이터", data, new Date());
        notifyEveryone("BUY_GOODS", payload);
      });
    },

    watchByeBye: () => {
      watchEvent("disconnect", () => {
        delete socketIdMap[sock.id];
        console.log(sock.id, "연결이 끊어졌어요!");
        emitSamePageViewerCount();
      });
    },
  };
}

io.on("connection", (sock) => {
  const { watchChangePage, watchBuying, watchByeBye } = initSocket(sock);

  watchChangePage();

  watchBuying();

  watchByeBye();
});
