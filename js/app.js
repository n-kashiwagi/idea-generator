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
            console.error('保存エラー:', error);
            showStatusMessage('単語帳の保存に失敗しました', false);
        });
    }
    
    // 単語帳の読み込み
    function loadWordBank() {
        fetch('data/word_bank.json')
            .then(response => response.json())
            .then(data => {
                wordBank = data;
                displayWordsByCategory('Will');
            })
            .catch(error => {
                console.error('単語帳の読み込みエラー:', error);
                showStatusMessage('単語帳の読み込みに失敗しました。', false);
            });
    }
    
    // アイデア帳の読み込み
    function loadIdeaBank() {
        fetch('data/idea_bank.json')
            .then(response => response.json())
            .then(data => {
                ideaBank = data;
            })
            .catch(error => {
                console.error('アイデア帳の読み込みエラー:', error);
                showStatusMessage('アイデア帳の読み込みに失敗しました。', false);
            });
    }
    
    // ステータスメッセージの表示
    function showStatusMessage(message, isSuccess) {
        statusMessageContainer.textContent = message;
        statusMessageContainer.className = isSuccess ? 'status-message status-success' : 'status-message status-error';
        statusMessageContainer.style.display = 'block';
        
        // 3秒後にメッセージを非表示
        setTimeout(() => {
            statusMessageContainer.style.display = 'none';
        }, 3000);
    }
    
    // カテゴリ別に単語を表示
    function displayWordsByCategory(category) {
        // すべての単語リストを非表示
        document.querySelectorAll('.word-list').forEach(list => {
            list.classList.add('hidden');
        });
        
        // タブの切り替え
        tabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // 対応するカテゴリの単語リストを表示
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
        
        // 単語リストを表示
        wordList.classList.remove('hidden');
    }
    
    // 単語の選択
    function selectWord(word) {
        // 既に選択されている場合は何もしない
        if (selectedWord1 === word || selectedWord2 === word) {
            return;
        }
        
        // 単語1が空いている場合
        if (!selectedWord1) {
            selectedWord1 = word;
            word1Element.textContent = word;
        } 
        // 単語2が空いている場合
        else if (!selectedWord2) {
            selectedWord2 = word;
            word2Element.textContent = word;
        }
        
        // 入力フィールドの有効化状態を更新
        updateInputState();
    }
    
    // ランダムに単語を選択
    function selectRandomWord(wordSlot) {
        // すべてのカテゴリの単語を一つの配列にまとめる
        const allWords = [
            ...wordBank.Will || [],
            ...wordBank.Must || [],
            ...wordBank.PEST || []
        ];
        
        if (allWords.length === 0) return;
        
        // 既に選択されている単語を除外
        let availableWords = allWords.filter(word => {
            if (wordSlot === 1) {
                return word !== selectedWord2;
            } else {
                return word !== selectedWord1;
            }
        });
        
        if (availableWords.length === 0) return;
        
        // ランダムに単語を選択
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const randomWord = availableWords[randomIndex];
        
        // 選択した単語をセット
        if (wordSlot === 1) {
            selectedWord1 = randomWord;
            word1Element.textContent = randomWord;
        } else {
            selectedWord2 = randomWord;
            word2Element.textContent = randomWord;
        }
        
        // 入力フィールドの有効化状態を更新
        updateInputState();
    }
    
    // 単語の解除
    function clearWord(wordSlot) {
        if (wordSlot === 1) {
            selectedWord1 = null;
            word1Element.textContent = '単語１';
        } else {
            selectedWord2 = null;
            word2Element.textContent = '単語２';
        }
        
        // 入力フィールドの有効化状態を更新
        updateInputState();
    }
    
    // 入力フィールドの有効化状態を更新
    function updateInputState() {
        if (selectedWord1 && selectedWord2) {
            ideaInput.disabled = false;
            saveButton.disabled = false;
            
            // 既存のアイデアを検索して表示
            const existingIdea = findExistingIdea();
            if (existingIdea) {
                ideaInput.value = existingIdea;
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
        if (!selectedWord1 || !selectedWord2) return null;
        
        // 順不同で検索
        const idea = ideaBank.ideas.find(idea => 
            (idea.word1 === selectedWord1 && idea.word2 === selectedWord2) || 
            (idea.word1 === selectedWord2 && idea.word2 === selectedWord1)
        );
        
        return idea ? idea.content : null;
    }
    
    // アイデアの保存
    function saveIdea() {
        if (!selectedWord1 || !selectedWord2 || !ideaInput.value.trim()) return;
        
        const ideaContent = ideaInput.value.trim();
        
        // 既存のアイデアを検索
        const existingIdeaIndex = ideaBank.ideas.findIndex(idea => 
            (idea.word1 === selectedWord1 && idea.word2 === selectedWord2) || 
            (idea.word1 === selectedWord2 && idea.word2 === selectedWord1)
        );
        
        // 既存のアイデアを更新または新しいアイデアを追加
        if (existingIdeaIndex !== -1) {
            ideaBank.ideas[existingIdeaIndex].content = ideaContent;
        } else {
            ideaBank.ideas.push({
                word1: selectedWord1,
                word2: selectedWord2,
                content: ideaContent
            });
        }
        
        // サーバーにアイデアを保存
        saveIdeaToServer();
    }
    
    // サーバーにアイデアを保存
    function saveIdeaToServer() {
        // 保存中の状態を表示
        saveButton.disabled = true;
        saveButton.textContent = '保存中...';
        
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
            // 保存成功
            showStatusMessage('アイデアが保存されました！', true);
            saveButton.textContent = 'アイデアを保存';
            saveButton.disabled = false;
        })
        .catch(error => {
            console.error('保存エラー:', error);
            
            // エラーメッセージを表示
            showStatusMessage('保存に失敗しました。ローカルに保存します。', false);
            
            // ローカルストレージに保存（フォールバック）
            localStorage.setItem('ideaBank', JSON.stringify(ideaBank));
            
            saveButton.textContent = 'アイデアを保存';
            saveButton.disabled = false;
        });
    }
});
