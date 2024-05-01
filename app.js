const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const getShortUrl = require("./utils/shortenURL");

// 設置視圖引擎和靜態文件中介軟體
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public")); // 使用 public 裡的靜態文件
app.use(express.urlencoded({ extended: true })); // 解析 POST 請求的數據

const fs = require("fs");
const path = require("path");

// 首頁路由處理
app.get('/', (req, res) => {
  res.render('index')
})

// 定義數據檔案路徑
const dataFilePath = path.join(__dirname, "data.json");

// 初始化 URL 數據，使用空對象作為默認值
let urlData = {};

// 確保數據文件存在並且讀取到數據
if (fs.existsSync(dataFilePath)) {
   try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    urlData = JSON.parse(data);
  } catch (error) {
    console.error("Unable to parse data.json:", error);
  }
}

// 在 POST /shorten 路由中，確保在寫入數據後再渲染模板
app.post('/shorten', (req, res) => {
  const originalURL = req.body.inputURL;

  if (!originalURL) {
    res.render("error", { errorMsg: "Please provide the original URL." });
    return;
  }

  // 檢查原始網址是否已經有對應的縮短網址
  if (urlData[originalURL]) {
    const shortURL = urlData[originalURL];
    res.render('index', { shortURL });
  } else {
    // 生成縮短網址
    const shortURL = getShortUrl();
    
    // 保存縮短的網址
    urlData[originalURL] = shortURL;
    fs.writeFile(dataFilePath, JSON.stringify(urlData), 'utf-8', (err) => {
      if (err) {
        console.error("Unable to write to data.json:", err);
        res.render("error", { errorMsg: "The data file cannot be written." });
      } else {
        res.render('index', { shortURL });
      }
    });
  }
});

//當使用者貼上短網址時，進行以下路由處理
app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL; 
  let originalURL
  for (const key in urlData) {
    if (urlData[key] === shortURL) {
      originalURL = key;
      break;
    }
  }

  if (originalURL) {
    res.redirect(originalURL);
  } else {
    res.status(404).send("The short URL was not found.");
  }
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});