let audioCtx = null;

window.playSound = function(type) {
    if (window.appState && !window.appState.soundEnabled) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.04);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(now + 0.04);
    } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + (i * 0.04));
            gain.gain.setValueAtTime(0.08, now + (i * 0.04));
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + (i * 0.04));
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now + (i * 0.04)); osc.stop(now + 0.35 + (i * 0.04));
        });
    }
};

const savedState = JSON.parse(localStorage.getItem('healing_app_state'));
window.appState = savedState || {
    level: 1,
    xp: 0,
    username: "Người lữ hành",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
    soundEnabled: true,
    glassEnabled: true, // THÊM TRẠNG THÁI BẬT TẮT GLASS
    themeColor: '#799488',
    textColor: '#2d3748',
    titleColor: '#ffffff',
    titleFont: "'Nunito', sans-serif",
    fontMain: "'Nunito', sans-serif",
    blurAmount: '16px',
    bgBlurAmount: '0px',
    bgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
    geminiKey: ''
};

function applyBackground(url) {
    const videoEl = document.getElementById('bg-video');
    if (videoEl) {
        if (url.toLowerCase().endsWith('.mp4') || url.includes('.mp4?')) {
            videoEl.src = url; videoEl.classList.remove('hidden');
            document.body.style.backgroundImage = "none";
        } else {
            videoEl.classList.add('hidden'); videoEl.src = "";
            document.body.style.backgroundImage = `url('${url}')`;
        }
    }
}

function applySavedTheme() {
    document.documentElement.style.setProperty('--primary', window.appState.themeColor);
    document.documentElement.style.setProperty('--text-main', window.appState.textColor || '#2d3748');
    document.documentElement.style.setProperty('--font-main', window.appState.fontMain);
    
    // ÁP DỤNG TRẠNG THÁI HIỆU ỨNG GLASS
    if (document.getElementById('toggle-glass')) {
        document.getElementById('toggle-glass').checked = window.appState.glassEnabled !== false;
    }
    const isGlass = window.appState.glassEnabled !== false;
    if (isGlass) {
        const blurVal = parseInt(window.appState.blurAmount) || 16;
        const alpha = Math.max(0.15, 0.6 - (blurVal / 100));
        document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${alpha})`);
        document.documentElement.style.setProperty('--blur-amount', window.appState.blurAmount);
    } else {
        // Tắt Glass: Làm nền trắng đặc, bỏ nhòe
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.95)');
        document.documentElement.style.setProperty('--blur-amount', '0px');
    }
    
    const overlay = document.getElementById('bg-blur-overlay');
    if (overlay) overlay.style.backdropFilter = `blur(${window.appState.bgBlurAmount || '0px'})`;
    
    applyBackground(window.appState.bgUrl);
    
    const mainTitleEl = document.getElementById('main-title-text');
    if (mainTitleEl) {
        mainTitleEl.style.color = window.appState.titleColor || '#ffffff';
        mainTitleEl.style.fontFamily = window.appState.titleFont || window.appState.fontMain;
    }
    if (document.getElementById('title-color')) {
        document.getElementById('title-color').value = window.appState.titleColor || '#ffffff';
    }

    if (document.getElementById('username-input')) document.getElementById('username-input').value = window.appState.username;
    if (document.getElementById('user-avatar')) document.getElementById('user-avatar').src = window.appState.avatar;
    if (document.getElementById('theme-color')) document.getElementById('theme-color').value = window.appState.themeColor;
    if (document.getElementById('text-color')) document.getElementById('text-color').value = window.appState.textColor || '#2d3748';
    if (document.getElementById('range-blur')) document.getElementById('range-blur').value = parseInt(window.appState.blurAmount);
    if (document.getElementById('blur-val')) document.getElementById('blur-val').innerText = window.appState.blurAmount;
    if (document.getElementById('range-bg-blur')) document.getElementById('range-bg-blur').value = parseInt(window.appState.bgBlurAmount || 0);
    if (document.getElementById('bg-blur-val')) document.getElementById('bg-blur-val').innerText = window.appState.bgBlurAmount || '0px';
    if (document.getElementById('toggle-sound')) document.getElementById('toggle-sound').checked = window.appState.soundEnabled;
    if (document.getElementById('gemini-key-input')) document.getElementById('gemini-key-input').value = window.appState.geminiKey || '';
    
    if (document.getElementById('user-level')) document.getElementById('user-level').innerText = window.appState.level;
    if (document.getElementById('user-xp')) document.getElementById('user-xp').innerText = window.appState.xp;
    if (document.getElementById('xp-bar')) document.getElementById('xp-bar').style.width = `${window.appState.xp}%`;
}

window.saveDataToStorage = function() {
    localStorage.setItem('healing_app_state', JSON.stringify(window.appState));
};

if (document.getElementById('username-input')) {
    document.getElementById('username-input').addEventListener('input', (e) => {
        window.appState.username = e.target.value.trim() || "Người lữ hành";
        window.saveDataToStorage();
    });
}

if (document.getElementById('avatar-container')) {
    document.getElementById('avatar-container').addEventListener('click', () => {
        document.getElementById('avatar-input').click();
    });
}

if (document.getElementById('avatar-input')) {
    document.getElementById('avatar-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                window.appState.avatar = event.target.result;
                document.getElementById('user-avatar').src = window.appState.avatar;
                window.saveDataToStorage();
            };
            reader.readAsDataURL(file);
        }
    });
}

const encouragementQuotes = [
    "Hành trình vạn dặm luôn bắt đầu từ một bước chân nhỏ. Bạn đang làm rất tốt!",
    "Chậm một chút cũng không sao, miễn là bạn không dừng lại. Hãy ôm lấy bản thân nhé.",
    "Mỗi thói quen nhỏ tích lũy hôm nay chính là một món quà tuyệt vời cho tương lai.",
    "Bạn đang tiến bộ lên mỗi ngày, ngay cả những lúc bạn cảm thấy mệt mỏi nhất.",
    "Hãy nuôi dưỡng tâm hồn và cơ thể thay vì áp lực. Bạn là một sự tồn tại quý giá."
];

window.triggerNewQuote = function() {
    const quoteEl = document.getElementById('healing-quote');
    if (quoteEl) {
        quoteEl.innerText = encouragementQuotes[Math.floor(Math.random() * encouragementQuotes.length)];
    }
};

window.updateXP = function(amount, event) {
    window.appState.xp += amount;
    
    if (window.appState.xp < 0) {
        if (window.appState.level > 1) {
            window.appState.level -= 1; 
            window.appState.xp += 100; 
        } else {
            window.appState.xp = 0; 
        }
    }
    
    if (event && amount > 0) {
        let x = 0, y = 0;
        if (event.pageX !== undefined && event.pageY !== undefined) {
            x = event.pageX; y = event.pageY;
        } else if (event.touches && event.touches[0]) {
            x = event.touches[0].pageX; y = event.touches[0].pageY;
        } else if (event.changedTouches && event.changedTouches[0]) {
            x = event.changedTouches[0].pageX; y = event.changedTouches[0].pageY;
        }
        
        if (x !== 0 && y !== 0) {
            showXPFloat(amount, x, y);
        }
    }
    
    if (window.appState.xp >= 100) {
        window.appState.level += 1; window.appState.xp -= 100;
        if (amount > 0) window.playSound('success');
    }
    
    window.triggerNewQuote(); 
    applySavedTheme(); 
    window.saveDataToStorage();
};

function showXPFloat(amount, x, y) {
    const el = document.createElement('div'); el.className = 'xp-float'; el.innerText = `+${amount} XP`;
    el.style.left = `${x}px`; el.style.top = `${y}px`; document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

if (document.getElementById('realtime-clock')) {
    function updateClock() {
        const now = new Date();
        document.getElementById('realtime-clock').innerText = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' | ' + now.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
    }
    setInterval(updateClock, 1000); updateClock();
}

document.body.addEventListener('click', () => {
    window.playSound('click');
});

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-primary'); b.classList.add('text-gray-400'); });
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
        e.currentTarget.classList.remove('text-gray-400'); e.currentTarget.classList.add('text-primary');
        const target = document.getElementById(e.currentTarget.getAttribute('data-target'));
        if (target) target.classList.remove('hidden');
    });
});

setTimeout(() => { applySavedTheme(); window.triggerNewQuote(); }, 150);