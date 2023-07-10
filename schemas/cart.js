const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // String 타입
    required: true, // 해당 field는 필수 요건
  },
  goodsId: {
    type: Number, // Number 타입
    required: true, // 해당 field는 필수 요건
  },
  quantity: {
    type: Number, // Number 타입
    required: true, // 해당 field는 필수 요건
  },
});

module.exports = mongoose.model("Cart", cartSchema);
