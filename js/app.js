let audioCtx = null;

window.playSound = function(type) {
    if (window.appState && !window.appState.soundEnabled) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(750, now); osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);
        gain.gain.setValueAtTime(0.06, now); gain.gain.linearRampToValueAtTime(0, now + 0.04);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(now + 0.04);
    } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.setValueAtTime(f, now + (i * 0.04));
            gain.gain.setValueAtTime(0.08, now + (i * 0.04)); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + (i * 0.04));
            osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now + (i * 0.04)); osc.stop(now + 0.35 + (i * 0.04));
        });
    }
};

const savedState = JSON.parse(localStorage.getItem('healing_app_state'));
window.appState = savedState || {
    level: 1, xp: 0, username: "Người lữ hành", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    soundEnabled: true, glassEnabled: true, themeColor: '#799488', textColor: '#2d3748', titleColor: '#ffffff',
    titleFont: "'Nunito', sans-serif", fontMain: "'Nunito', sans-serif", blurAmount: '16px', bgBlurAmount: '0px',
    bgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    geminiKey: '',
    journalPin: '', 
    language: 'vi', 
    zodiac: ''      
};

window.saveDataToStorage = function() { localStorage.setItem('healing_app_state', JSON.stringify(window.appState)); };

// ==========================================
// TÍNH NĂNG ĐA NGÔN NGỮ (VI/EN)
// ==========================================
const dict = {
    vi: {
        main_title: "KHÔNG GIAN TINH THẦN", healing_quote_title: "Lời nhắn chữa lành",
        skincare: "Lịch Skincare", fitness: "Lịch Thể Dục", custom_habit: "Thói Quen Tự Tạo",
        journal_title: "Viết Nhật Ký Cảm Xúc", emotion_history: "Tiến trình cảm xúc", save_journal: "Lưu tâm sự",
        cun_chat_title: "Trạm Tâm Sự Cùng Cún", cun_intro: "Gâu gâu! 🐶 Mình là Cún Corgi đây. Cậu đang có tâm sự gì à, kể Cún nghe đi! ❤️",
        notes: "Sổ Tay Ghi Chú", save_note: "Lưu ghi chú",
        health_stats: "Chỉ số cơ thể", gen_routine: "✨ Phân Tích Routine", ai_chat_title: "Trợ Lý AI Buddy",
        buddy_intro: "Mình là **AI Healing Buddy** đây! Điền chỉ số hoặc trò chuyện với mình nhé! 🌟",
        savings: "Mục Tiêu", start_tracking: "Bắt Đầu Theo Dõi", cancel: "Hủy",
        settings_title: "Cài Đặt Studio",
        nav_habit: "Thói Quen", nav_journal: "Nhật Ký", nav_notes: "Ghi Chú", nav_ai: "AI Buddy", nav_savings: "Mục Tiêu", nav_settings: "Cài Đặt",
        universe: "Vũ Trụ", universe_msg: "Lời Nhắn Vũ Trụ", close: "Đóng lại",
        excellent: "Xuất Sắc Quá Bạn Ơi!", thanks: "Cảm ơn góc chữa lành ✨",
        feel_sorry: "Thương bạn quá!", healing_msg: "Hôm nay có vẻ là một ngày mệt mỏi và nhiều cảm xúc nhỉ. Cứ khóc hay tức giận nếu muốn nhé, không sao đâu!",
        suggestion: "Gợi ý nhỏ:", cun_suggest: "Bạn có muốn sang tâm sự với AI Cún Corgi không? Cún rất giỏi lắng nghe và xoa dịu đó.",
        chat_cun: "Tâm sự với Cún 🐶", not_now: "Không phải bây giờ",
        enter_pin: "Nhập mã PIN để mở khóa", zodiac_prompt: "Để nhận thông điệp, vũ trụ cần biết chòm sao của bạn:", connect_universe: "Kết nối Vũ Trụ ✨"
    },
    en: {
        main_title: "SPIRITUAL SPACE", healing_quote_title: "Healing Quote",
        skincare: "Skincare Routine", fitness: "Fitness Tracker", custom_habit: "Custom Habits",
        journal_title: "Emotional Journal", emotion_history: "Emotion Timeline", save_journal: "Save Entry",
        cun_chat_title: "Corgi Chat Station", cun_intro: "Woof woof! 🐶 I'm Corgi. Are you having a heavy heart? Tell me everything! ❤️",
        notes: "Notepad", save_note: "Save Note",
        health_stats: "Body Metrics", gen_routine: "✨ Generate Routine", ai_chat_title: "AI Buddy",
        buddy_intro: "I am your **AI Healing Buddy**! Enter your stats or chat with me! 🌟",
        savings: "Goals", start_tracking: "Start Tracking", cancel: "Cancel",
        settings_title: "Studio Settings",
        nav_habit: "Habits", nav_journal: "Journal", nav_notes: "Notes", nav_ai: "AI Buddy", nav_savings: "Goals", nav_settings: "Settings",
        universe: "Universe", universe_msg: "Cosmic Message", close: "Close",
        excellent: "Excellent Job!", thanks: "Thanks to this space ✨",
        feel_sorry: "I feel you!", healing_msg: "Today seems tiring and emotional. It's okay to cry or be angry!",
        suggestion: "Small suggestion:", cun_suggest: "Do you want to chat with Corgi AI? He is a great listener.",
        chat_cun: "Chat with Corgi 🐶", not_now: "Not right now",
        enter_pin: "Enter PIN to unlock", zodiac_prompt: "To receive the message, the universe needs your sign:", connect_universe: "Connect Universe ✨"
    }
};

function applyLanguage() {
    const lang = window.appState.language || 'vi';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[lang][key]) el.innerText = dict[lang][key];
    });
}
const btnLang = document.getElementById('btn-toggle-lang');
if (btnLang) {
    btnLang.addEventListener('click', () => {
        window.appState.language = window.appState.language === 'vi' ? 'en' : 'vi';
        window.saveDataToStorage(); applyLanguage(); window.playSound('click'); window.triggerNewQuote();
    });
}

// ==========================================
// TÍNH NĂNG MỚI: PHỤC HỒI LỜI NHẮN CHỮA LÀNH
// ==========================================
window.triggerNewQuote = function() {
    const lang = window.appState.language || 'vi';
    const quotes = {
        vi: [
            "Hành trình vạn dặm luôn bắt đầu từ một bước chân nhỏ. Bạn đang làm rất tốt!",
            "Chậm một chút cũng không sao, miễn là bạn không dừng lại. Hãy ôm lấy bản thân nhé.",
            "Mỗi thói quen nhỏ tích lũy hôm nay chính là một món quà tuyệt vời cho tương lai.",
            "Bạn đang tiến bộ lên mỗi ngày, ngay cả những lúc bạn cảm thấy mệt mỏi nhất.",
            "Hãy nuôi dưỡng tâm hồn và cơ thể thay vì áp lực. Bạn là một sự tồn tại quý giá."
        ],
        en: [
            "A journey of a thousand miles begins with a single step. You are doing great!",
            "It's okay to slow down, as long as you don't stop. Give yourself a hug.",
            "Every small habit accumulated today is a wonderful gift for the future.",
            "You are making progress every day, even when you feel the most tired.",
            "Nourish your soul and body instead of pressuring them. You are precious."
        ]
    };
    
    const quoteEl = document.getElementById('healing-quote');
    if (quoteEl) {
        const list = quotes[lang] || quotes['vi'];
        quoteEl.innerText = list[Math.floor(Math.random() * list.length)];
    }
};

// ==========================================
// TÍNH NĂNG MỚI: BẢO MẬT NHẬT KÝ BẰNG MÃ PIN
// ==========================================
let enteredPin = "";
function initLockScreen() {
    const pinSetup = document.getElementById('pin-setup-input');
    const btnSavePin = document.getElementById('btn-save-pin');
    if (pinSetup) pinSetup.value = window.appState.journalPin || '';
    
    if (btnSavePin) {
        btnSavePin.addEventListener('click', () => {
            const newPin = pinSetup.value.trim();
            if (newPin.length !== 4 && newPin.length !== 0) { alert("Mã PIN phải có đúng 4 số!"); return; }
            window.appState.journalPin = newPin; window.saveDataToStorage();
            alert("Đã lưu cài đặt mã khóa Nhật ký thành công!");
        });
    }

    const lockScreen = document.getElementById('journal-lock-screen');
    const contentArea = document.getElementById('journal-content-area');
    
    // Nếu có PIN thì bật màn hình khóa, ẩn nội dung
    if (window.appState.journalPin) {
        lockScreen.classList.remove('hidden'); contentArea.classList.add('opacity-0', 'pointer-events-none');
        buildKeypad();
    } else {
        lockScreen.classList.add('hidden'); contentArea.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function buildKeypad() {
    const keypad = document.getElementById('pin-keypad');
    if (!keypad) return;
    keypad.innerHTML = '';
    const keys = [1,2,3,4,5,6,7,8,9,'C',0,'OK'];
    keys.forEach(k => {
        const btn = document.createElement('button');
        btn.className = `p-3 text-lg font-bold rounded-full border border-primary/30 hover:bg-primary/20 transition-all ${k==='C'?'text-red-400':''} ${k==='OK'?'bg-primary text-white':''}`;
        btn.innerText = k;
        btn.addEventListener('click', () => handlePinInput(k));
        keypad.appendChild(btn);
    });
}

function handlePinInput(val) {
    window.playSound('click');
    if (val === 'C') { enteredPin = ""; }
    else if (val === 'OK') {
        if (enteredPin === window.appState.journalPin) {
            document.getElementById('journal-lock-screen').classList.add('hidden');
            document.getElementById('journal-content-area').classList.remove('opacity-0', 'pointer-events-none');
            enteredPin = ""; updatePinDots();
        } else {
            document.getElementById('pin-error-msg').innerText = "Mã PIN không đúng!";
            enteredPin = ""; setTimeout(() => document.getElementById('pin-error-msg').innerText = "", 2000);
        }
    }
    else { if (enteredPin.length < 4) enteredPin += val; }
    updatePinDots();
}

function updatePinDots() {
    for(let i=1; i<=4; i++) {
        const dot = document.getElementById(`pin-dot-${i}`);
        if(dot) { if (i <= enteredPin.length) dot.classList.add('filled'); else dot.classList.remove('filled'); }
    }
}

// ==========================================
// TÍNH NĂNG MỚI: XUẤT VÀ NHẬP DỮ LIỆU
// ==========================================
const btnExport = document.getElementById('btn-export-data');
if (btnExport) {
    btnExport.addEventListener('click', () => {
        const dataToExport = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('healing_')) dataToExport[key] = localStorage.getItem(key);
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "healing_space_backup.json");
        document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove();
        alert("Đã tải tệp sao lưu thành công!");
    });
}

const triggerImport = document.getElementById('btn-import-data-trigger');
const fileImport = document.getElementById('import-data-file');
if (triggerImport && fileImport) {
    triggerImport.addEventListener('click', () => fileImport.click());
    fileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsedData = JSON.parse(evt.target.result);
                for (const key in parsedData) { if (key.startsWith('healing_')) localStorage.setItem(key, parsedData[key]); }
                alert("Khôi phục dữ liệu thành công! Ứng dụng sẽ tải lại.");
                location.reload();
            } catch (err) { alert("File không hợp lệ hoặc bị lỗi."); }
        };
        reader.readAsText(file);
    });
}

// ==========================================
// TÍNH NĂNG MỚI: LỜI NHẮN TỪ VŨ TRỤ (ASTROLOGY)
// ==========================================
const btnAstro = document.getElementById('btn-open-astrology');
const popupAstro = document.getElementById('astrology-popup');
const btnCloseAstro = document.getElementById('btn-close-astrology');
const btnSaveZodiac = document.getElementById('btn-save-zodiac');

if (btnAstro) {
    btnAstro.addEventListener('click', () => {
        popupAstro.classList.remove('hidden');
        if (window.appState.zodiac) {
            document.getElementById('zodiac-setup').classList.add('hidden');
            document.getElementById('zodiac-message-box').classList.remove('hidden');
            fetchCosmicMessage();
        } else {
            document.getElementById('zodiac-setup').classList.remove('hidden');
            document.getElementById('zodiac-message-box').classList.add('hidden');
        }
    });
}

if (btnSaveZodiac) {
    btnSaveZodiac.addEventListener('click', () => {
        const select = document.getElementById('zodiac-select');
        if (!select.value) return alert("Vui lòng chọn cung hoàng đạo của bạn!");
        window.appState.zodiac = select.value; window.saveDataToStorage();
        document.getElementById('zodiac-setup').classList.add('hidden');
        document.getElementById('zodiac-message-box').classList.remove('hidden');
        fetchCosmicMessage();
    });
}
if (btnCloseAstro) btnCloseAstro.addEventListener('click', () => popupAstro.classList.add('hidden'));

async function fetchCosmicMessage() {
    const apiKey = window.appState.geminiKey;
    const contentBox = document.getElementById('astrology-content');
    if (!apiKey) { contentBox.innerHTML = `⚠️ Vũ trụ bị mất kết nối... Hãy dán API Key ở mục Cài đặt nhé.`; return; }
    
    contentBox.innerHTML = `Đang lắng nghe tín hiệu từ vì sao ${window.appState.zodiac}... 🌠`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `Lấy tư cách là Vũ Trụ, hãy gửi 1 thông điệp ngắn (dưới 50 từ), thơ mộng và mang năng lượng chữa lành nhất trong ngày hôm nay cho người thuộc cung ${window.appState.zodiac}. Dùng icon chiêm tinh.` }] }] })
        });
        const data = await response.json();
        if (data.candidates) contentBox.innerHTML = data.candidates[0].content.parts[0].text;
        else contentBox.innerHTML = "Tín hiệu bị nhiễu...";
    } catch (e) { contentBox.innerHTML = "Lỗi kết nối từ trái đất..."; }
}

// --- CÁC HÀM GỐC GIỮ NGUYÊN ---
function applyBackground(url) {
    const videoEl = document.getElementById('bg-video');
    if (videoEl) {
        if (url.toLowerCase().endsWith('.mp4') || url.includes('.mp4?')) {
            videoEl.src = url; videoEl.classList.remove('hidden'); document.body.style.backgroundImage = "none";
        } else {
            videoEl.classList.add('hidden'); videoEl.src = ""; document.body.style.backgroundImage = `url('${url}')`;
        }
    }
}

function applySavedTheme() {
    document.documentElement.style.setProperty('--primary', window.appState.themeColor);
    document.documentElement.style.setProperty('--text-main', window.appState.textColor || '#2d3748');
    document.documentElement.style.setProperty('--font-main', window.appState.fontMain);
    
    if (document.getElementById('toggle-glass')) document.getElementById('toggle-glass').checked = window.appState.glassEnabled !== false;
    if (window.appState.glassEnabled !== false) {
        const blurVal = parseInt(window.appState.blurAmount) || 16;
        document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${Math.max(0.15, 0.6 - (blurVal / 100))})`);
        document.documentElement.style.setProperty('--blur-amount', window.appState.blurAmount);
    } else {
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.95)');
        document.documentElement.style.setProperty('--blur-amount', '0px');
    }
    
    applyBackground(window.appState.bgUrl);
    applyLanguage();
    
    const mainTitleEl = document.getElementById('main-title-text');
    if (mainTitleEl) { mainTitleEl.style.color = window.appState.titleColor || '#ffffff'; mainTitleEl.style.fontFamily = window.appState.titleFont || window.appState.fontMain; }
    
    if (document.getElementById('username-input')) document.getElementById('username-input').value = window.appState.username;
    if (document.getElementById('user-avatar')) document.getElementById('user-avatar').src = window.appState.avatar;
    if (document.getElementById('theme-color')) document.getElementById('theme-color').value = window.appState.themeColor;
    if (document.getElementById('text-color')) document.getElementById('text-color').value = window.appState.textColor || '#2d3748';
    
    if (document.getElementById('user-level')) document.getElementById('user-level').innerText = window.appState.level;
    if (document.getElementById('user-xp')) document.getElementById('user-xp').innerText = window.appState.xp;
    if (document.getElementById('xp-bar')) document.getElementById('xp-bar').style.width = `${window.appState.xp}%`;
}

window.updateXP = function(amount, event) {
    window.appState.xp += amount;
    if (window.appState.xp < 0) { if (window.appState.level > 1) { window.appState.level -= 1; window.appState.xp += 100; } else { window.appState.xp = 0; } }
    if (event && amount > 0) {
        let x = 0, y = 0;
        if (event.pageX) { x = event.pageX; y = event.pageY; } 
        else if (event.touches) { x = event.touches[0].pageX; y = event.touches[0].pageY; }
        if (x !== 0 && y !== 0) {
            const el = document.createElement('div'); el.className = 'xp-float'; el.innerText = `+${amount} XP`;
            el.style.left = `${x}px`; el.style.top = `${y}px`; document.body.appendChild(el); setTimeout(() => el.remove(), 800);
        }
    }
    if (window.appState.xp >= 100) { window.appState.level += 1; window.appState.xp -= 100; if (amount > 0) window.playSound('success'); }
    
    window.triggerNewQuote(); // Refresh lại lời nhắn mỗi khi cộng điểm
    applySavedTheme(); window.saveDataToStorage();
};

if (document.getElementById('realtime-clock')) {
    setInterval(() => {
        const now = new Date();
        document.getElementById('realtime-clock').innerText = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' | ' + now.toLocaleDateString('vi-VN');
    }, 1000);
}

document.body.addEventListener('click', () => window.playSound('click'));
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(e.currentTarget.getAttribute('data-target') === 'tab-journal') initLockScreen();
        
        document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
        e.currentTarget.classList.add('active');
        const target = document.getElementById(e.currentTarget.getAttribute('data-target'));
        if (target) target.classList.remove('hidden');
    });
});

// KHỞI CHẠY QUOTE VÀ NGÔN NGỮ KHI TẢI TRANG
setTimeout(() => { applySavedTheme(); window.triggerNewQuote(); }, 150);