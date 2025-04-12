// アプリケーションの状態
const appState = {
    currentScreen: 'start',
    currentQuestionIndex: 0,
    answers: {},
    result: {
        score: 0,
        category: '',
        recommendations: []
    },
    liffInitialized: false,
    userId: null,
    displayName: null
};

// 質問データ
const questions = [
    {
        id: 'facilityType',
        category: 'basics',
        text: '医療機関の種類を選択してください',
        type: 'radio',
        options: [
            { value: 'hospital', text: '病院', score: 5 },
            { value: 'clinic', text: 'クリニック', score: 8 },
            { value: 'dental', text: '歯科医院', score: 7 },
            { value: 'orthopedic', text: '整骨院・整形外科', score: 6 },
            { value: 'dermatology', text: '皮膚科', score: 7 },
            { value: 'ophthalmology', text: '眼科', score: 6 },
            { value: 'other', text: 'その他専門科', score: 5 }
        ]
    },
    {
        id: 'visitType',
        category: 'basics',
        text: '診療科目の特性として最も当てはまるものを選択してください',
        type: 'radio',
        options: [
            { value: 'regular', text: '定期的な通院が必要', score: 10 },
            { value: 'irregular', text: '不定期の通院', score: 7 },
            { value: 'emergency', text: '緊急時のみの受診', score: 3 },
            { value: 'preventive', text: '予防・検診中心', score: 9 }
        ]
    },
    {
        id: 'patientAge',
        category: 'basics',
        text: '患者層の年齢構成はどのようになっていますか？',
        type: 'radio',
        options: [
            { value: 'young', text: '若年層中心', score: 10 },
            { value: 'mixed', text: '幅広い年齢層', score: 7 },
            { value: 'senior', text: 'シニア層中心', score: 5 }
        ]
    },
    {
        id: 'challenges',
        category: 'goals',
        text: '現在抱えている主な課題を選択してください（複数選択可）',
        type: 'checkbox',
        options: [
            { value: 'newPatients', text: '新規患者獲得', score: 2 },
            { value: 'revisitRate', text: '再診率向上', score: 2 },
            { value: 'reservationManagement', text: '予約管理の効率化', score: 2 },
            { value: 'infoSharing', text: '診療案内の周知', score: 1 },
            { value: 'healthInfo', text: '健康情報提供', score: 1 },
            { value: 'communication', text: '患者とのコミュニケーション強化', score: 2 }
        ]
    },
    {
        id: 'currentCommunication',
        category: 'goals',
        text: '患者コミュニケーションの現状はどのようになっていますか？',
        type: 'radio',
        options: [
            { value: 'faceOnly', text: '対面のみ', score: 3 },
            { value: 'phoneMain', text: '電話中心', score: 5 },
            { value: 'emailUse', text: 'メール活用', score: 7 },
            { value: 'appUse', text: '独自アプリ活用', score: 6 },
            { value: 'paperBased', text: '紙媒体中心', score: 4 }
        ]
    },
    {
        id: 'differentiation',
        category: 'goals',
        text: '医療機関としての差別化ポイントは何ですか？',
        type: 'radio',
        options: [
            { value: 'expertise', text: '専門性の高さ', score: 6 },
            { value: 'detailedExplanation', text: '丁寧な説明・対応', score: 8 },
            { value: 'latestEquipment', text: '最新設備', score: 5 },
            { value: 'goodAccess', text: 'アクセスの良さ', score: 6 },
            { value: 'easyReservation', text: '予約の取りやすさ', score: 9 },
            { value: 'shortWaitTime', text: '待ち時間の少なさ', score: 7 }
        ]
    },
    {
        id: 'patientRelationship',
        category: 'relationship',
        text: '患者との関係性の特徴として最も当てはまるものを選択してください',
        type: 'radio',
        options: [
            { value: 'longTerm', text: '長期的な関係構築が中心', score: 10 },
            { value: 'temporary', text: '一時的な対応が中心', score: 4 },
            { value: 'preventive', text: '予防・定期検診中心', score: 8 },
            { value: 'mixed', text: '混合', score: 6 }
        ]
    },
    {
        id: 'reservationMethod',
        category: 'relationship',
        text: '現在の予約管理方法はどのようになっていますか？',
        type: 'radio',
        options: [
            { value: 'phoneMain', text: '電話予約中心', score: 5 },
            { value: 'webReservation', text: 'Webサイトから予約', score: 8 },
            { value: 'appReservation', text: 'アプリ予約', score: 9 },
            { value: 'counterReservation', text: '受付での直接予約', score: 4 },
            { value: 'reservationSystem', text: '予約システム使用', score: 7 }
        ]
    },
    {
        id: 'patientDataManagement',
        category: 'relationship',
        text: '患者データの管理状況はどのようになっていますか？',
        type: 'radio',
        options: [
            { value: 'fullEMR', text: '電子カルテ完備', score: 8 },
            { value: 'partialDigital', text: '部分的にデータ化', score: 6 },
            { value: 'paperBased', text: '紙カルテ中心', score: 3 }
        ]
    },
    {
        id: 'infoToProvide',
        category: 'communication',
        text: '患者に提供したい情報・サービスを選択してください（複数選択可）',
        type: 'checkbox',
        options: [
            { value: 'hoursInfo', text: '診療時間・休診情報', score: 2 },
            { value: 'healthInfo', text: '健康情報・セルフケア案内', score: 2 },
            { value: 'checkupReminder', text: '検診リマインド', score: 2 },
            { value: 'facilityNews', text: '医院からのお知らせ', score: 1 },
            { value: 'reservationConfirm', text: '予約確認・変更', score: 3 }
        ]
    },
    {
        id: 'inquiryResponse',
        category: 'communication',
        text: '患者からの問い合わせ対応への期待はどのようなものですか？',
        type: 'radio',
        options: [
            { value: 'realtime', text: 'リアルタイム対応希望', score: 5 },
            { value: 'businessHours', text: '営業時間内の対応で十分', score: 8 },
            { value: 'automated', text: '自動応答で十分', score: 10 },
            { value: 'undecided', text: '未定', score: 5 }
        ]
    },
    {
        id: 'marketingInterest',
        category: 'communication',
        text: '集客・マーケティングへの関心度はどの程度ですか？',
        type: 'radio',
        options: [
            { value: 'veryInterested', text: '積極的に取り組みたい', score: 10 },
            { value: 'interested', text: '興味はあるが方法がわからない', score: 8 },
            { value: 'lowPriority', text: '必要性は感じるが優先度は低い', score: 5 },
            { value: 'notNeeded', text: 'あまり必要性を感じない', score: 2 }
        ]
    }
];

// カテゴリーウェイト
const categoryWeights = {
    'basics': 1.2,  // 基本情報
    'goals': 1.5,   // 課題と目標
    'relationship': 1.5,  // 患者関係性
    'communication': 1.3  // コミュニケーションニーズ
};

// 施策例データ
const recommendationsByCategory = {
    'high': [
        '予約管理システム: LINEで診察予約の確認通知・リマインド機能を実装',
        '健康情報配信: 定期的な健康アドバイスや予防情報をLINEで配信',
        '待ち時間通知: 混雑状況や順番待ちの進行状況をLINEで通知',
        '診療時間変更・休診情報: 急な予定変更をリアルタイムで患者に通知',
        '来院前の簡易問診: LINEの回答フォーム機能を活用した事前情報収集'
    ],
    'medium': [
        '診療案内・お知らせ配信: 診療内容や医院情報を定期的に配信',
        '検診リマインド: 定期検診の時期を自動でお知らせ',
        '簡易的な予約確認: 予約日前日のリマインドメッセージ送信',
        'よくある質問の自動応答: 診療時間や場所などの基本的な質問に自動応答',
        '季節の健康情報: 感染症情報など季節に応じた健康アドバイスの提供'
    ],
    'conditional': [
        '限定的な情報発信: 重要なお知らせのみを配信する最小限の運用',
        '特定患者層向けコミュニケーション: 若年層患者に限定したLINE活用',
        '段階的な機能追加: 基本的な機能から始めて徐々に拡張',
        '特定サービスのみでの活用: 予防接種案内など特定目的に限定した活用',
        'テスト運用からスタート: 小規模な患者グループでテスト実施'
    ],
    'low': [
        '代替手段の検討: メールや電話などの既存チャネルの強化',
        '院内ポスターやリーフレット: 紙媒体での情報提供の充実',
        'Webサイトの充実: LINE以前にWebサイトの情報充実を優先',
        '将来的なLINE活用の準備: データ管理やデジタル対応力の強化',
        '既存患者コミュニケーションの改善: 現状の仕組みの最適化'
    ]
};

// LIFFの初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeLiff();
});

// LIFF初期化関数
async function initializeLiff() {
    try {
        // LIFF IDは実際のものに置き換えてください
        await liff.init({ liffId: '2007246789-YAboD5Gq' });
        
        appState.liffInitialized = true;
        
        if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            appState.userId = profile.userId;
            appState.displayName = profile.displayName;
        } 
        
        renderApp();
    } catch (error) {
        console.error('LIFFの初期化に失敗しました', error);
        document.getElementById('app').innerHTML = `
            <div class="p-4 bg-red-100 text-red-700 rounded-lg">
                <p class="font-bold">エラーが発生しました</p>
                <p>アプリの読み込みに失敗しました。再度お試しください。</p>
            </div>
        `;
    }
}

// アプリのレンダリング
function renderApp() {
    const appElement = document.getElementById('app');
    
    switch (appState.currentScreen) {
        case 'start':
            renderStartScreen(appElement);
            break;
        case 'question':
            renderQuestionScreen(appElement);
            break;
        case 'result':
            renderResultScreen(appElement);
            break;
        default:
            renderStartScreen(appElement);
    }
}

// スタート画面のレンダリング
function renderStartScreen(element) {
    element.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen text-center">
            <img src="https://placehold.jp/06b6d4/ffffff/150x150.png?text=診断" alt="LINE運用診断" class="w-32 h-32 mb-6 rounded-full shadow-lg">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">医療機関向けLINE運用診断</h1>
            <p class="text-gray-600 mb-6">あなたの医療機関にLINE活用が適しているかを診断します</p>
            <div class="bg-white p-6 rounded-lg shadow-md w-full mb-6">
                <h2 class="text-lg font-semibold text-gray-700 mb-3">診断について</h2>
                <p class="text-gray-600 mb-4">この診断では、12の質問を通じてあなたの医療機関のLINE活用適性度を測定します。</p>
                <ul class="text-gray-600 text-left list-disc list-inside mb-4">
                    <li>所要時間: 約5〜10分</li>
                    <li>質問数: 全12問</li>
                    <li>結果: LINE活用の適性度と具体的な活用アイデア</li>
                </ul>
                <p class="text-gray-600">回答内容は診断結果の算出とご相談時のみに使用します。</p>
            </div>
            <button id="startBtn" class="btn-primary">診断を始める</button>
        </div>
    `;
    
    document.getElementById('startBtn').addEventListener('click', () => {
        appState.currentScreen = 'question';
        renderApp();
    });
}

// 質問画面のレンダリング
function renderQuestionScreen(element) {
    const currentQuestion = questions[appState.currentQuestionIndex];
    const progress = ((appState.currentQuestionIndex + 1) / questions.length) * 100;
    
    element.innerHTML = `
        <div class="min-h-screen flex flex-col">
            <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>質問 ${appState.currentQuestionIndex + 1}/${questions.length}</span>
                    <span>${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">${currentQuestion.text}</h2>
                <div id="options" class="mb-6">
                    ${renderOptions(currentQuestion)}
                </div>
            </div>
            
            <div class="mt-auto flex justify-between">
                ${appState.currentQuestionIndex > 0 ? 
                    `<button id="prevBtn" class="btn-secondary">前へ</button>` : 
                    `<div></div>`
                }
                <button id="nextBtn" class="btn-primary ${isQuestionAnswered(currentQuestion.id) ? '' : 'opacity-50 cursor-not-allowed'}">
                    ${appState.currentQuestionIndex === questions.length - 1 ? '結果を見る' : '次へ'}
                </button>
            </div>
        </div>
    `;
    
    // イベントリスナーの設定
    setupQuestionEventListeners(currentQuestion);
}

// 質問の選択肢をレンダリング
function renderOptions(question) {
    if (question.type === 'radio') {
        return question.options.map(option => {
            const isSelected = appState.answers[question.id] === option.value;
            return `
                <div class="radio-option ${isSelected ? 'selected' : ''}" data-value="${option.value}">
                    <div class="mr-3 w-5 h-5 rounded-full border-2 ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'} flex items-center justify-center">
                        ${isSelected ? '<div class="w-2 h-2 rounded-full bg-white"></div>' : ''}
                    </div>
                    <span>${option.text}</span>
                </div>
            `;
        }).join('');
    } else if (question.type === 'checkbox') {
        return question.options.map(option => {
            const selectedOptions = appState.answers[question.id] || [];
            const isSelected = selectedOptions.includes(option.value);
            return `
                <div class="checkbox-option ${isSelected ? 'selected' : ''}" data-value="${option.value}">
                    <div class="mr-3 w-5 h-5 rounded border-2 ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300'} flex items-center justify-center">
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>' : ''}
                    </div>
                    <span>${option.text}</span>
                </div>
            `;
        }).join('');
    }
    return '';
}

// 質問画面のイベントリスナー設定
function setupQuestionEventListeners(question) {
    const options = document.querySelectorAll('#options .radio-option, #options .checkbox-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const value = option.getAttribute('data-value');
            
            if (question.type === 'radio') {
                appState.answers[question.id] = value;
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            } else if (question.type === 'checkbox') {
                if (!appState.answers[question.id]) {
                    appState.answers[question.id] = [];
                }
                
                const currentAnswers = appState.answers[question.id];
                if (currentAnswers.includes(value)) {
                    appState.answers[question.id] = currentAnswers.filter(v => v !== value);
                    option.classList.remove('selected');
                } else {
                    appState.answers[question.id] = [...currentAnswers, value];
                    option.classList.add('selected');
                }
            }
            
            // 次へボタンの有効化
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) {
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    });
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!isQuestionAnswered(question.id)) {
                return;
            }
            
            if (appState.currentQuestionIndex === questions.length - 1) {
                calculateResult();
                appState.currentScreen = 'result';
            } else {
                appState.currentQuestionIndex++;
            }
            renderApp();
        });
    }
    
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (appState.currentQuestionIndex > 0) {
                appState.currentQuestionIndex--;
                renderApp();
            }
        });
    }
}

// 質問が回答済みかチェック
function isQuestionAnswered(questionId) {
    const answer = appState.answers[questionId];
    if (answer === undefined) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    return true;
}

// カテゴリー別スコアのレンダリング
function renderCategoryScores() {
    const categoryScores = {
        'basics': { score: 0, maxScore: 0, label: '基本情報' },
        'goals': { score: 0, maxScore: 0, label: '課題と目標' },
        'relationship': { score: 0, maxScore: 0, label: '患者関係性' },
        'communication': { score: 0, maxScore: 0, label: 'コミュニケーションニーズ' }
    };
    
    // カテゴリー別のスコアを計算
    questions.forEach(question => {
        const answer = appState.answers[question.id];
        if (!answer) return;
        
        if (question.type === 'radio') {
            const option = question.options.find(opt => opt.value === answer);
            if (option) {
                categoryScores[question.category].score += option.score * categoryWeights[question.category];
                categoryScores[question.category].maxScore += 10 * categoryWeights[question.category]; // 10は最大スコア
            }
        } else if (question.type === 'checkbox') {
            answer.forEach(selectedValue => {
                const option = question.options.find(opt => opt.value === selectedValue);
                if (option) {
                    categoryScores[question.category].score += option.score * categoryWeights[question.category];
                }
            });
            
            // チェックボックスの場合の最大スコアを計算
            const maxPossibleScore = question.options.reduce((total, opt) => total + opt.score, 0);
            categoryScores[question.category].maxScore += maxPossibleScore * categoryWeights[question.category];
        }
    });
    
    // カテゴリー別のHTML生成
    return Object.keys(categoryScores).map(category => {
        const { score, maxScore, label } = categoryScores[category];
        const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
        
        let colorClass;
        if (percentage >= 80) colorClass = 'bg-green-500';
        else if (percentage >= 60) colorClass = 'bg-yellow-500';
        else if (percentage >= 40) colorClass = 'bg-orange-500';
        else colorClass = 'bg-red-500';
        
        return `
            <div>
                <div class="flex justify-between mb-1">
                    <span class="text-sm font-medium text-gray-700">${label}</span>
                    <span class="text-sm font-medium text-gray-700">${percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="${colorClass} h-2.5 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// 結果画面のレンダリング
function renderResultScreen(element) {
    let resultClass;
    let resultText;
    
    if (appState.result.score >= 80) {
        resultClass = 'result-high';
        resultText = 'LINE活用を強く推奨';
    } else if (appState.result.score >= 60) {
        resultClass = 'result-medium';
        resultText = 'LINE活用の可能性あり';
    } else if (appState.result.score >= 40) {
        resultClass = 'result-conditional';
        resultText = '条件付きでLINE活用検討可能';
    } else {
        resultClass = 'result-low';
        resultText = '現状ではLINE以外の手段も検討推奨';
    }
    
    element.innerHTML = `
        <div class="min-h-screen">
            <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                <h1 class="text-xl font-bold text-gray-800 mb-4">診断結果</h1>
                
                <div class="mb-6">
                    <div class="result-category ${resultClass} text-center">${resultText}</div>
                    <div class="text-center mb-4">
                        <div class="text-4xl font-bold">${appState.result.score}点</div>
                        <div class="text-sm text-gray-500">LINE活用適性度</div>
                    </div>
                    
                    <div class="h-4 w-full bg-gray-200 rounded-full">
                        <div class="h-4 rounded-full" 
                            style="width: ${appState.result.score}%; 
                            background-color: ${
                                appState.result.score >= 80 ? '#10b981' : 
                                appState.result.score >= 60 ? '#f59e0b' : 
                                appState.result.score >= 40 ? '#f97316' : '#ef4444'
                            }">
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">おすすめのLINE活用例</h2>
                    <ul class="list-disc list-inside text-gray-700">
                        ${appState.result.recommendations.map(rec => `<li class="mb-2">${rec}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-2">カテゴリー別評価</h2>
                    <div class="space-y-2">
                        ${renderCategoryScores()}
                    </div>
                </div>
                
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-gray-700 mb-2">診断結果に基づく詳しいアドバイスやお悩みをお聞きしたい場合は、ぜひご相談ください。</p>
                    <button id="sendResultBtn" class="btn-primary w-full mb-2">結果をメッセージで送信する</button>
                    <button id="consultBtn" class="btn-secondary w-full">専門家に相談する</button>
                </div>
            </div>
            
            <button id="restartBtn" class="btn-secondary w-full">診断をやり直す</button>
        </div>
    `;
    
    // イベントリスナー設定
    setupResultEventListeners();
}

// 結果画面のイベントリスナー設定
function setupResultEventListeners() {
    // 結果送信ボタン
    const sendResultBtn = document.getElementById('sendResultBtn');
    if (sendResultBtn) {
        sendResultBtn.addEventListener('click', sendResultMessage);
    }
    
    // 相談ボタン
    const consultBtn = document.getElementById('consultBtn');
    if (consultBtn) {
        consultBtn.addEventListener('click', sendConsultMessage);
    }
    
    // やり直しボタン
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            appState.currentScreen = 'start';
            appState.currentQuestionIndex = 0;
            appState.answers = {};
            appState.result = {
                score: 0,
                category: '',
                recommendations: []
            };
            renderApp();
        });
    }
}

// 診断結果のメッセージ送信
async function sendResultMessage() {
    if (!liff.isInClient()) {
        alert('この機能はLINE内でのみ使用できます');
        return;
    }
    
    try {
        let resultCategory;
        if (appState.result.score >= 80) resultCategory = '高適性';
        else if (appState.result.score >= 60) resultCategory = '中適性';
        else if (appState.result.score >= 40) resultCategory = '条件付き適性';
        else resultCategory = '低適性';
        
        const message = {
            type: 'flex',
            altText: 'LINE運用診断結果',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: 'LINE運用診断結果',
                            weight: 'bold',
                            size: 'lg',
                            color: '#ffffff'
                        }
                    ],
                    backgroundColor: '#06b6d4'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                        {
                            type: 'text',
                            text: `${appState.result.score}点 - ${resultCategory}`,
                            weight: 'bold',
                            size: 'xl',
                            margin: 'md'
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
                            margin: 'lg',
                            spacing: 'sm',
                            contents: [
                                {
                                    type: 'text',
                                    text: 'おすすめのLINE活用例',
                                    weight: 'bold'
                                },
                                ...appState.result.recommendations.slice(0, 3).map(rec => ({
                                    type: 'text',
                                    text: `・${rec.split(':')[0]}`,
                                    size: 'sm',
                                    color: '#555555',
                                    wrap: true
                                }))
                            ]
                        }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        {
                            type: 'button',
                            style: 'primary',
                            action: {
                                type: 'uri',
                                label: '詳細を見る',
                                uri: 'https://liff.line.me/yourLiffId' // 実際のLIFF URLに置き換え
                            },
                            color: '#06b6d4'
                        }
                    ]
                }
            }
        };
        
        await liff.sendMessages([message]);
        alert('診断結果を送信しました');
    } catch (error) {
        console.error('メッセージ送信エラー', error);
        alert('メッセージの送信に失敗しました');
    }
}

// 相談メッセージの送信
async function sendConsultMessage() {
    if (!liff.isInClient()) {
        alert('この機能はLINE内でのみ使用できます');
        return;
    }
    
    try {
        // 回答内容を整形
        let answersText = '■ 診断回答内容\n\n';
        
        questions.forEach((question, index) => {
            const answer = appState.answers[question.id];
            if (!answer) return;
            
            answersText += `${index + 1}. ${question.text}\n`;
            
            if (question.type === 'radio') {
                const option = question.options.find(opt => opt.value === answer);
                if (option) {
                    answersText += `回答: ${option.text}\n\n`;
                }
            } else if (question.type === 'checkbox' && Array.isArray(answer)) {
                const selectedOptions = answer.map(value => {
                    const option = question.options.find(opt => opt.value === value);
                    return option ? option.text : '';
                }).filter(text => text);
                
                answersText += `回答: ${selectedOptions.join(', ')}\n\n`;
            }
        });
        
        let resultCategory;
        if (appState.result.score >= 80) resultCategory = '高適性';
        else if (appState.result.score >= 60) resultCategory = '中適性';
        else if (appState.result.score >= 40) resultCategory = '条件付き適性';
        else resultCategory = '低適性';
        
        const consultMessage = {
            type: 'text',
            text: `【LINE運用診断相談】\n\n診断結果: ${appState.result.score}点 (${resultCategory})\n\n${answersText}\n専門家への相談を希望します。`
        };
        
        await liff.sendMessages([consultMessage]);
        alert('相談メッセージを送信しました。専門家からのご連絡をお待ちください。');
    } catch (error) {
        console.error('相談メッセージ送信エラー', error);
        alert('メッセージの送信に失敗しました');
    }
}

// 診断結果の計算
function calculateResult() {
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // カテゴリー別にスコアを集計
    questions.forEach(question => {
        const answer = appState.answers[question.id];
        if (!answer) return;
        
        if (question.type === 'radio') {
            const option = question.options.find(opt => opt.value === answer);
            if (option) {
                totalScore += option.score * categoryWeights[question.category];
                maxPossibleScore += 10 * categoryWeights[question.category]; // 10は最大スコア
            }
        } else if (question.type === 'checkbox' && Array.isArray(answer)) {
            answer.forEach(selectedValue => {
                const option = question.options.find(opt => opt.value === selectedValue);
                if (option) {
                    totalScore += option.score * categoryWeights[question.category];
                }
            });
            
            // チェックボックスの場合の最大スコアを計算
            const maxPossibleCheckboxScore = question.options.reduce((total, opt) => total + opt.score, 0);
            maxPossibleScore += maxPossibleCheckboxScore * categoryWeights[question.category];
        }
    });
    
    // 100点満点に換算
    const normalizedScore = Math.round((totalScore / maxPossibleScore) * 100);
    appState.result.score = normalizedScore;
    
    // 結果カテゴリーと推奨事項を設定
    if (normalizedScore >= 80) {
        appState.result.category = 'high';
        appState.result.recommendations = recommendationsByCategory.high;
    } else if (normalizedScore >= 60) {
        appState.result.category = 'medium';
        appState.result.recommendations = recommendationsByCategory.medium;
    } else if (normalizedScore >= 40) {
        appState.result.category = 'conditional';
        appState.result.recommendations = recommendationsByCategory.conditional;
    } else {
        appState.result.category = 'low';
        appState.result.recommendations = recommendationsByCategory.low;
    }
}