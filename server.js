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

// 単語帳保存APIエンドポイント
app.post('/api/save-words', (req, res) => {
  try {
    const wordBank = req.body;
    
    // データの検証
    if (!wordBank || typeof wordBank !== 'object') {
      return res.status(400).json({ success: false, message: '無効なデータ形式です' });
    }
    
    // 各カテゴリが配列であることを確認
    const categories = ['Will', 'Must', 'PEST'];
    for (const category of categories) {
      if (wordBank[category] && !Array.isArray(wordBank[category])) {
        return res.status(400).json({ 
          success: false, 
          message: `カテゴリ ${category} のデータ形式が無効です` 
        });
      }
    }
    
    // JSONファイルに保存
    fs.writeFileSync(
      path.join(__dirname, 'data', 'word_bank.json'),
      JSON.stringify(wordBank, null, 2),
      'utf8'
    );
    
    res.json({ success: true, message: '単語帳が保存されました' });
  } catch (error) {
    console.error('単語帳保存エラー:', error);
    res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
