const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { // email 필드
    type: String,
    required: true, // 해당 field는 필수 요건
    unique: true, // 해당 field는 중복된 값을 허용하지 않음
  },
  nickname: { // nickname 필드
    type: String,
    required: true, // 해당 field는 필수 요건
    unique: true, // 해당 field는 중복된 값을 허용하지 않음
  },
  password: { // password 필드
    type: String,
    required: true,
  },
});

// 가상의 userId 값을 할당
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

// user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
UserSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);