const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname)));

// JSONリクエストの解析
app.use(bodyParser.json());

// アイデア保存APIエンドポイント
app.post('/api/save-idea', (req, res) => {
  try {
    const ideaBank = req.body;
    
    // データの検証
    if (!ideaBank || !ideaBank.ideas || !Array.isArray(ideaBank.ideas)) {
      return res.status(400).json({ success: false, message: '無効なデータ形式です' });
    }
    
    // JSONファイルに保存
    fs.writeFileSync(
      path.join(__dirname, 'data', 'idea_bank.json'),
      JSON.stringify(ideaBank, null, 2),
      'utf8'
    );
    
    res.json({ success: true, message: 'アイデアが保存されました' });
  } catch (error) {
    console.error('保存エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
