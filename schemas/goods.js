const mongoose = require("mongoose");

const goodsSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true, // 해당 field는 필수 요건
    unique: true, // 해당 field는 중복된 값을 허용하지 않음
  },
  name: {
    type: String,
    required: true, // 해당 field는 필수 요건
    unique: true, // 해당 field는 중복된 값을 허용하지 않음
  },
  thumbnailUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
});

module.exports = mongoose.model("Goods", goodsSchema);
