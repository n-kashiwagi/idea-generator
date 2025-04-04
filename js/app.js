document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得 - ログイン関連
    const loginScreen = document.getElementById('loginScreen');
    const appScreen = document.getElementById('appScreen');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');
    const logoutButton = document.getElementById('logoutButton');
    
    // DOM要素の取得 - 単語管理関連
    const wordManageButton = document.getElementById('wordManageButton');
    const wordManageModal = document.getElementById('wordManageModal');
    const closeModal = document.getElementById('closeModal');
    const manageWillWords = document.getElementById('manageWillWords');
    const manageMustWords = document.getElementById('manageMustWords');
    const managePestWords = document.getElementById('managePestWords');
    const wordManageTabs = document.querySelectorAll('.word-manage-tabs .tab');
    const newWordInput = document.getElementById('newWord');
    const addWordButton = document.getElementById('addWord');
    const saveWordsButton = document.getElementById('saveWords');
    
    // DOM要素の取得 - アプリケーション関連
    const word1Element = document.getElementById('word1');
    const word2Element = document.getElementById('word2');
    const ideaInput = document.getElementById('ideaInput');
    const saveButton = document.getElementById('saveIdea');
    const random1Button = document.getElementById('random1');
    const random2Button = document.getElementById('random2');
    const clear1Button = document.getElementById('clear1');
    const clear2Button = document.getElementById('clear2');
    const willWordsList = document.getElementById('willWords');
    const mustWordsList = document.getElementById('mustWords');
    const pestWordsList = document.getElementById('pestWords');
    const tabs = document.querySelectorAll('.tabs .tab');
    
    // DOM要素の取得 - ダウンロード関連
    const downloadIdeasButton = document.getElementById('downloadIdeasButton');
    
    // データ保存用の変数
    let wordBank = {};
    let ideaBank = { ideas: [] };
    let selectedWord1 = null;
    let selectedWord2 = null;
    let currentManageCategory = 'Will';
    let isAuthenticated = false;
    
    // 正しいパスワード
    const CORRECT_PASSWORD = 'sysidealink';
    
    // ステータスメッセージ表示用の要素を作成
    const statusMessageContainer = document.createElement('div');
    statusMessageContainer.className = 'status-message';
    statusMessageContainer.style.display = 'none';
    document.querySelector('.idea-input-container').appendChild(statusMessageContainer);
    
    // 初期化
    init();
    
    function init() {
        // ログイン状態の確認
        checkAuthStatus();
        
        // イベントリスナーの設定
        setupEventListeners();
    }
    
    // ログイン状態の確認
    function checkAuthStatus() {
        // セッションストレージからログイン状態を取得
        isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated) {
            showApp();
            loadWordBank();
            loadIdeaBank();
        } else {
            showLogin();
        }
    }
    
    // イベントリスナーの設定
    function setupEventListeners() {
        // ログイン関連
        loginButton.addEventListener('click', handleLogin);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
        logoutButton.addEventListener('click', handleLogout);
        
        // 単語管理関連
        wordManageButton.addEventListener('click', openWordManageModal);
        closeModal.addEventListener('click', closeWordManageModal);
        wordManageTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                currentManageCategory = tab.dataset.manageCategory;
                displayManageWordsByCategory(currentManageCategory);
            });
        });
        addWordButton.addEventListener('click', addNewWord);
        saveWordsButton.addEventListener('click', saveWordBank);
        
        // アプリケーション関連
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                displayWordsByCategory(tab.dataset.category);
            });
        });
        random1Button.addEventListener('click', () => selectRandomWord(1));
        random2Button.addEventListener('click', () => selectRandomWord(2));
        clear1Button.addEventListener('click', () => clearWord(1));
        clear2Button.addEventListener('click', () => clearWord(2));
        saveButton.addEventListener('click', saveIdea);
        
        // ダウンロード関連
        downloadIdeasButton.addEventListener('click', downloadIdeaBank);
    }
    
    // ログイン処理
    function handleLogin() {
        const password = passwordInput.value;
        
        if (password === CORRECT_PASSWORD) {
            // ログイン成功
            isAuthenticated = true;
            sessionStorage.setItem('isAuthenticated', 'true');
            loginError.textContent = '';
            passwordInput.value = '';
            showApp();
            loadWordBank();
            loadIdeaBank();
        } else {
            // ログイン失敗
            loginError.textContent = 'パスワードが正しくありません';
            passwordInput.value = '';
        }
    }
    
    // ログアウト処理
    function handleLogout() {
        isAuthenticated = false;
        sessionStorage.removeItem('isAuthenticated');
        showLogin();
    }
    
    // ログイン画面を表示
    function showLogin() {
        loginScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
    
    // アプリケーション画面を表示
    function showApp() {
        loginScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
    }
    
    // 単語管理モーダルを開く
    function openWordManageModal() {
        displayManageWordsByCategory('Will');
        wordManageModal.classList.remove('hidden');
    }
    
    // 単語管理モーダルを閉じる
    function closeWordManageModal() {
        wordManageModal.classList.add('hidden');
    }
    
    // 単語管理画面に単語を表示
    function displayManageWordsByCategory(category) {
        // タブの切り替え
        wordManageTabs.forEach(tab => {
            if (tab.dataset.manageCategory === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 単語リストの切り替え
        manageWillWords.classList.add('hidden');
        manageMustWords.classList.add('hidden');
        managePestWords.classList.add('hidden');
        
        let wordList;
        switch(category) {
            case 'Will':
                wordList = manageWillWords;
                break;
            case 'Must':
                wordList = manageMustWords;
                break;
            case 'PEST':
                wordList = managePestWords;
                break;
        }
        
        // 単語リストをクリア
        wordList.innerHTML = '';
        
        // 単語を追加
        if (wordBank[category]) {
            wordBank[category].forEach(word => {
                const wordItem = document.createElement('div');
                wordItem.className = 'word-manage-item';
                
                const wordText = document.createElement('span');
                wordText.textContent = word;
                
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-word';
                deleteButton.textContent = '×';
                deleteButton.addEventListener('click', () => deleteWord(category, word));
                
                wordItem.appendChild(wordText);
                wordItem.appendChild(deleteButton);
                wordList.appendChild(wordItem);
            });
        }
        
        wordList.classList.remove('hidden');
        currentManageCategory = category;
    }
    
    // 新しい単語を追加
    function addNewWord() {
        const newWord = newWordInput.value.trim();
        
        if (!newWord) {
            return;
        }
        
        // 既に存在する単語かチェック
        if (wordBank[currentManageCategory] && wordBank[currentManageCategory].includes(newWord)) {
            showStatusMessage('この単語は既に存在します', false);
            return;
        }
        
        // 単語を追加
        if (!wordBank[currentManageCategory]) {
            wordBank[currentManageCategory] = [];
        }
        
        wordBank[currentManageCategory].push(newWord);
        
        // 単語リストを更新
        displayManageWordsByCategory(currentManageCategory);
        
        // 入力フィールドをクリア
        newWordInput.value = '';
    }
    
    // 単語を削除
    function deleteWord(category, word) {
        if (wordBank[category]) {
            const index = wordBank[category].indexOf(word);
            if (index !== -1) {
                wordBank[category].splice(index, 1);
                displayManageWordsByCategory(category);
            }
        }
    }
    
    // 単語帳を保存
    function saveWordBank() {
        fetch('/api/save-words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(wordBank)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('サーバーエラー: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            showStatusMessage('単語帳が保存されました！', true);
            closeWordManageModal();
            
            // メイン画面の単語リストを更新
            displayWordsByCategory(document.querySelector('.tabs .tab.active').dataset.category);
        })
        .catch(error => {
            console.error('単語帳保存エラー:', error);
            showStatusMessage('単語帳の保存に失敗しました。ローカルストレージに保存します。', false);
            
            // エラー時はローカルストレージに保存
            localStorage.setItem('wordBank', JSON.stringify(wordBank));
            closeWordManageModal();
            
            // メイン画面の単語リストを更新
            displayWordsByCategory(document.querySelector('.tabs .tab.active').dataset.category);
        });
    }
    
    // 単語帳を読み込み
    function loadWordBank() {
        fetch('/data/word_bank.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('サーバーエラー: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            wordBank = data;
            
            // ローカルストレージの単語帳と同期
            const localWordBank = localStorage.getItem('wordBank');
            if (localWordBank) {
                try {
                    const parsedLocalWordBank = JSON.parse(localWordBank);
                    
                    // サーバーデータとローカルデータをマージ
                    for (const category in parsedLocalWordBank) {
                        if (!wordBank[category]) {
                            wordBank[category] = [];
                        }
                        
                        parsedLocalWordBank[category].forEach(word => {
                            if (!wordBank[category].includes(word)) {
                                wordBank[category].push(word);
                            }
                        });
                    }
                    
                    // マージしたデータをサーバーに保存
                    saveWordBank();
                } catch (e) {
                    console.error('ローカルストレージの単語帳の解析エラー:', e);
                }
            }
            
            // メイン画面の単語リストを更新
            displayWordsByCategory('Will');
        })
        .catch(error => {
            console.error('単語帳読み込みエラー:', error);
            
            // エラー時はローカルストレージから読み込み
            const localWordBank = localStorage.getItem('wordBank');
            if (localWordBank) {
                try {
                    wordBank = JSON.parse(localWordBank);
                } catch (e) {
                    console.error('ローカルストレージの単語帳の解析エラー:', e);
                    wordBank = {
                        'Will': ['自動化', 'AI', 'ロボット', 'IoT', 'ブロックチェーン', 'VR', 'AR', 'クラウド', '5G', '量子コンピュータ'],
                        'Must': ['品質向上', 'コスト削減', '効率化', '安全性', '持続可能性', '顧客満足', '従業員満足', 'コンプライアンス', 'リスク管理', 'イノベーション'],
                        'PEST': ['パンデミック', '気候変動', '高齢化', 'グローバル化', 'デジタル化', '規制強化', '資源枯渇', '格差拡大', '都市化', '地政学的リスク']
                    };
                }
            } else {
                // デフォルトの単語帳
                wordBank = {
                    'Will': ['自動化', 'AI', 'ロボット', 'IoT', 'ブロックチェーン', 'VR', 'AR', 'クラウド', '5G', '量子コンピュータ'],
                    'Must': ['品質向上', 'コスト削減', '効率化', '安全性', '持続可能性', '顧客満足', '従業員満足', 'コンプライアンス', 'リスク管理', 'イノベーション'],
                    'PEST': ['パンデミック', '気候変動', '高齢化', 'グローバル化', 'デジタル化', '規制強化', '資源枯渇', '格差拡大', '都市化', '地政学的リスク']
                };
            }
            
            // メイン画面の単語リストを更新
            displayWordsByCategory('Will');
        });
    }
    
    // アイデア帳を読み込み
    function loadIdeaBank() {
        fetch('/data/idea_bank.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('サーバーエラー: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            ideaBank = data;
            
            // ローカルストレージのアイデア帳と同期
            const localIdeaBank = localStorage.getItem('ideaBank');
            if (localIdeaBank) {
                try {
                    const parsedLocalIdeaBank = JSON.parse(localIdeaBank);
                    
                    // サーバーデータとローカルデータをマージ
                    parsedLocalIdeaBank.ideas.forEach(localIdea => {
                        const exists = ideaBank.ideas.some(serverIdea => 
                            (serverIdea.word1 === localIdea.word1 && serverIdea.word2 === localIdea.word2) ||
                            (serverIdea.word1 === localIdea.word2 && serverIdea.word2 === localIdea.word1)
                        );
                        
                        if (!exists) {
                            ideaBank.ideas.push(localIdea);
                        }
                    });
                    
                    // マージしたデータをサーバーに保存
                    saveIdeaBankToServer();
                } catch (e) {
                    console.error('ローカルストレージのアイデア帳の解析エラー:', e);
                }
            }
            
            // 選択されている単語があれば、対応するアイデアを表示
            updateIdeaInput();
        })
        .catch(error => {
            console.error('アイデア帳読み込みエラー:', error);
            
            // エラー時はローカルストレージから読み込み
            const localIdeaBank = localStorage.getItem('ideaBank');
            if (localIdeaBank) {
                try {
                    ideaBank = JSON.parse(localIdeaBank);
                } catch (e) {
                    console.error('ローカルストレージのアイデア帳の解析エラー:', e);
                    ideaBank = { ideas: [] };
                }
            } else {
                ideaBank = { ideas: [] };
            }
            
            // 選択されている単語があれば、対応するアイデアを表示
            updateIdeaInput();
        });
    }
    
    // アイデア帳をサーバーに保存
    function saveIdeaBankToServer() {
        fetch('/api/save-idea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ideaBank)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('サーバーエラー: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('アイデア帳が保存されました');
        })
        .catch(error => {
            console.error('アイデア帳保存エラー:', error);
            // エラー時はローカルストレージに保存
            localStorage.setItem('ideaBank', JSON.stringify(ideaBank));
        });
    }
    
    // アイデア帳をダウンロード
    function downloadIdeaBank() {
        // アイデア帳データをJSON文字列に変換
        const ideaBankJSON = JSON.stringify(ideaBank, null, 2);
        
        // Blobオブジェクトを作成
        const blob = new Blob([ideaBankJSON], { type: 'application/json' });
        
        // ダウンロード用のURLを作成
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンクを作成
        const a = document.createElement('a');
        a.href = url;
        a.download = 'idea_bank.json';
        
        // リンクをクリック（ダウンロード開始）
        document.body.appendChild(a);
        a.click();
        
        // 不要になったリンクとURLを削除
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showStatusMessage('アイデア帳をダウンロードしました！', true);
    }
    
    // カテゴリ別に単語を表示
    function displayWordsByCategory(category) {
        // タブの切り替え
        tabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 単語リストの切り替え
        willWordsList.classList.add('hidden');
        mustWordsList.classList.add('hidden');
        pestWordsList.classList.add('hidden');
        
        let wordList;
        switch(category) {
            case 'Will':
                wordList = willWordsList;
                break;
            case 'Must':
                wordList = mustWordsList;
                break;
            case 'PEST':
                wordList = pestWordsList;
                break;
        }
        
        // 単語リストをクリア
        wordList.innerHTML = '';
        
        // 単語を追加
        if (wordBank[category]) {
            wordBank[category].forEach(word => {
                const wordItem = document.createElement('div');
                wordItem.className = 'word-item';
                wordItem.textContent = word;
                wordItem.addEventListener('click', () => selectWord(word));
                wordList.appendChild(wordItem);
            });
        }
        
        wordList.classList.remove('hidden');
    }
    
    // 単語を選択
    function selectWord(word) {
        if (!selectedWord1) {
            selectedWord1 = word;
            word1Element.textContent = word;
            word1Element.classList.add('selected');
        } else if (!selectedWord2 && word !== selectedWord1) {
            selectedWord2 = word;
            word2Element.textContent = word;
            word2Element.classList.add('selected');
        }
        
        updateIdeaInput();
    }
    
    // ランダムに単語を選択
    function selectRandomWord(wordNum) {
        // 現在選択されているカテゴリを取得
        const activeCategory = document.querySelector('.tabs .tab.active').dataset.category;
        
        if (!wordBank[activeCategory] || wordBank[activeCategory].length === 0) {
            return;
        }
        
        // 既に選択されている単語を除外
        let availableWords = [...wordBank[activeCategory]];
        if (wordNum === 1 && selectedWord2) {
            availableWords = availableWords.filter(word => word !== selectedWord2);
        } else if (wordNum === 2 && selectedWord1) {
            availableWords = availableWords.filter(word => word !== selectedWord1);
        }
        
        if (availableWords.length === 0) {
            return;
        }
        
        // ランダムに単語を選択
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const randomWord = availableWords[randomIndex];
        
        if (wordNum === 1) {
            selectedWord1 = randomWord;
            word1Element.textContent = randomWord;
            word1Element.classList.add('selected');
        } else {
            selectedWord2 = randomWord;
            word2Element.textContent = randomWord;
            word2Element.classList.add('selected');
        }
        
        updateIdeaInput();
    }
    
    // 選択した単語をクリア
    function clearWord(wordNum) {
        if (wordNum === 1) {
            selectedWord1 = null;
            word1Element.textContent = '単語１';
            word1Element.classList.remove('selected');
        } else {
            selectedWord2 = null;
            word2Element.textContent = '単語２';
            word2Element.classList.remove('selected');
        }
        
        updateIdeaInput();
    }
    
    // アイデア入力欄を更新
    function updateIdeaInput() {
        if (selectedWord1 && selectedWord2) {
            ideaInput.disabled = false;
            saveButton.disabled = false;
            
            // 既存のアイデアがあるか検索
            const existingIdea = findExistingIdea();
            if (existingIdea) {
                ideaInput.value = existingIdea.idea;
            } else {
                ideaInput.value = '';
            }
        } else {
            ideaInput.disabled = true;
            saveButton.disabled = true;
            ideaInput.value = '';
        }
    }
    
    // 既存のアイデアを検索
    function findExistingIdea() {
        return ideaBank.ideas.find(item => 
            (item.word1 === selectedWord1 && item.word2 === selectedWord2) ||
            (item.word1 === selectedWord2 && item.word2 === selectedWord1)
        );
    }
    
    // アイデアを保存
    function saveIdea() {
        if (!selectedWord1 || !selectedWord2 || !ideaInput.value.trim()) {
            return;
        }
        
        const newIdea = {
            word1: selectedWord1,
            word2: selectedWord2,
            idea: ideaInput.value.trim()
        };
        
        // 既存のアイデアがあるか検索
        const existingIndex = ideaBank.ideas.findIndex(item => 
            (item.word1 === selectedWord1 && item.word2 === selectedWord2) ||
            (item.word1 === selectedWord2 && item.word2 === selectedWord1)
        );
        
        if (existingIndex !== -1) {
            // 既存のアイデアを更新
            ideaBank.ideas[existingIndex] = newIdea;
        } else {
            // 新しいアイデアを追加
            ideaBank.ideas.push(newIdea);
        }
        
        // アイデア帳を保存
        saveIdeaBankToServer();
        
        showStatusMessage('アイデアが保存されました！', true);
    }
    
    // ステータスメッセージを表示
    function showStatusMessage(message, isSuccess) {
        statusMessageContainer.textContent = message;
        statusMessageContainer.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336';
        statusMessageContainer.style.display = 'block';
        
        // 3秒後にメッセージを非表示
        setTimeout(() => {
            statusMessageContainer.style.display = 'none';
        }, 3000);
    }
});
