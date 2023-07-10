const http = require("./app.js");
require("./socket.js");

const port = 3000;

// app 대신 http 객체로 서버 열기
http.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
