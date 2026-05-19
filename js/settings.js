const toggleGlass = document.getElementById('toggle-glass');
if (toggleGlass) {
    toggleGlass.addEventListener('change', (e) => {
        window.appState.glassEnabled = e.target.checked;
        const isGlass = window.appState.glassEnabled;
        if (isGlass) {
            const blurVal = parseInt(window.appState.blurAmount) || 16;
            const alpha = Math.max(0.15, 0.6 - (blurVal / 100));
            document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${alpha})`);
            document.documentElement.style.setProperty('--blur-amount', window.appState.blurAmount);
        } else {
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.95)');
            document.documentElement.style.setProperty('--blur-amount', '0px');
        }
        window.saveDataToStorage();
    });
}

const rangeBlur = document.getElementById('range-blur');
if (rangeBlur) {
    rangeBlur.addEventListener('input', (e) => {
        const blur = e.target.value;
        document.getElementById('blur-val').innerText = `${blur}px`;
        window.appState.blurAmount = `${blur}px`;
        
        if (window.appState.glassEnabled !== false) {
            const alpha = Math.max(0.15, 0.6 - (blur / 100));
            window.appState.glassBg = `rgba(255, 255, 255, ${alpha})`;
            document.documentElement.style.setProperty('--blur-amount', window.appState.blurAmount);
            document.documentElement.style.setProperty('--glass-bg', window.appState.glassBg);
        }
        window.saveDataToStorage();
    });
}

const rangeBgBlur = document.getElementById('range-bg-blur');
if (rangeBgBlur) {
    rangeBgBlur.addEventListener('input', (e) => {
        const bgBlur = e.target.value;
        document.getElementById('bg-blur-val').innerText = `${bgBlur}px`;
        window.appState.bgBlurAmount = `${bgBlur}px`;
        const overlay = document.getElementById('bg-blur-overlay');
        if(overlay) overlay.style.backdropFilter = `blur(${bgBlur}px)`;
        window.saveDataToStorage();
    });
}

// CÀI ĐẶT MÃ PIN (Mang ra không gian chung để dễ lấy sự kiện Click)
const btnSavePin = document.getElementById('btn-save-pin');
const pinSetup = document.getElementById('pin-setup-input');
if (pinSetup) pinSetup.value = window.appState.journalPin || '';

if (btnSavePin) {
    btnSavePin.addEventListener('click', () => {
        const newPin = pinSetup.value.trim();
        if (newPin.length !== 4 && newPin.length !== 0) { 
            alert("Mã PIN phải có đúng 4 số!"); 
            return; 
        }
        window.appState.journalPin = newPin; 
        window.saveDataToStorage();
        alert("Đã lưu cài đặt mã khóa Nhật ký thành công!");
    });
}

const btnApplyFont = document.getElementById('btn-apply-font');
if (btnApplyFont) {
    btnApplyFont.addEventListener('click', (e) => {
        e.stopPropagation();
        const fontName = document.getElementById('google-font-input').value.trim();
        if (fontName) {
            const fontLink = document.createElement('link');
            fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;600;700;800&display=swap`;
            fontLink.rel = 'stylesheet'; document.head.appendChild(fontLink);
            window.appState.fontMain = `'${fontName}', sans-serif`;
            document.documentElement.style.setProperty('--font-main', window.appState.fontMain);
            document.getElementById('google-font-input').value = ''; window.saveDataToStorage();
        }
    });
}

const titleColor = document.getElementById('title-color');
if (titleColor) {
    titleColor.addEventListener('input', (e) => {
        window.appState.titleColor = e.target.value;
        const mainTitleEl = document.getElementById('main-title-text');
        if (mainTitleEl) mainTitleEl.style.color = e.target.value;
        window.saveDataToStorage();
    });
}

const btnApplyTitleFont = document.getElementById('btn-apply-title-font');
if (btnApplyTitleFont) {
    btnApplyTitleFont.addEventListener('click', (e) => {
        e.stopPropagation();
        const fontName = document.getElementById('title-font-input').value.trim();
        if (fontName) {
            const fontLink = document.createElement('link');
            fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;600;700;800&display=swap`;
            fontLink.rel = 'stylesheet'; document.head.appendChild(fontLink);
            
            window.appState.titleFont = `'${fontName}', sans-serif`;
            const mainTitleEl = document.getElementById('main-title-text');
            if (mainTitleEl) mainTitleEl.style.fontFamily = window.appState.titleFont;
            document.getElementById('title-font-input').value = '';
            window.saveDataToStorage();
        }
    });
}

const themeColor = document.getElementById('theme-color');
if (themeColor) {
    themeColor.addEventListener('input', (e) => {
        window.appState.themeColor = e.target.value;
        document.documentElement.style.setProperty('--primary', window.appState.themeColor);
        window.saveDataToStorage();
    });
}

const textColor = document.getElementById('text-color');
if (textColor) {
    textColor.addEventListener('input', (e) => {
        window.appState.textColor = e.target.value;
        document.documentElement.style.setProperty('--text-main', window.appState.textColor);
        window.saveDataToStorage();
    });
}

const btnApplyBg = document.getElementById('btn-apply-bg');
if (btnApplyBg) {
    btnApplyBg.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = document.getElementById('custom-bg-input').value.trim();
        if (url) {
            window.appState.bgUrl = url;
            const videoEl = document.getElementById('bg-video');
            if (videoEl) {
                if (url.toLowerCase().endsWith('.mp4') || url.includes('.mp4?')) {
                    videoEl.src = url; videoEl.classList.remove('hidden'); document.body.style.backgroundImage = "none";
                } else {
                    videoEl.classList.add('hidden'); videoEl.src = ""; document.body.style.backgroundImage = `url('${url}')`;
                }
            }
            document.getElementById('custom-bg-input').value = ''; window.saveDataToStorage();
        }
    });
}

const geminiKeyInput = document.getElementById('gemini-key-input');
if (geminiKeyInput) {
    geminiKeyInput.addEventListener('input', (e) => {
        window.appState.geminiKey = e.target.value.trim(); window.saveDataToStorage();
    });
}

const toggleSound = document.getElementById('toggle-sound');
if (toggleSound) {
    toggleSound.addEventListener('change', (e) => {
        window.appState.soundEnabled = e.target.checked; window.saveDataToStorage();
    });
}

const btnResetApp = document.getElementById('btn-reset-app');
if (btnResetApp) {
    btnResetApp.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (confirm("⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TOÀN BỘ DỮ LIỆU?\n\nTất cả thói quen, nhật ký, ghi chú, mục tiêu tiết kiệm và cài đặt sẽ bị xóa sạch khỏi trình duyệt này.\n\nHành động này KHÔNG THỂ HOÀN TÁC!")) {
            localStorage.clear();
            alert("Đã xóa sạch dữ liệu. Web sẽ tải lại ngay bây giờ!");
            window.location.replace(window.location.pathname); 
        }
    });
}