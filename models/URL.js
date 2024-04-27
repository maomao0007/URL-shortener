const mongoose = require("mongoose");

// 定義模式（Schema）
const urlSchema = new mongoose.Schema({
  shortURL: String,
  originalURL: String,
});

// 創建模型
const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
