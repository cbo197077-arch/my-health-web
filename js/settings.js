// LẮNG NGHE SỰ KIỆN BẬT/TẮT HIỆU ỨNG GLASS
document.getElementById('toggle-glass').addEventListener('change', (e) => {
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

// Điều chỉnh lại thanh kéo mờ cho khớp với trạng thái Glass
document.getElementById('range-blur').addEventListener('input', (e) => {
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

document.getElementById('range-bg-blur').addEventListener('input', (e) => {
    const bgBlur = e.target.value;
    document.getElementById('bg-blur-val').innerText = `${bgBlur}px`;
    window.appState.bgBlurAmount = `${bgBlur}px`;
    document.getElementById('bg-blur-overlay').style.backdropFilter = `blur(${bgBlur}px)`;
    window.saveDataToStorage();
});

document.getElementById('btn-apply-font').addEventListener('click', (e) => {
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

// ĐỔI MÀU CHỮ TIÊU ĐỀ
document.getElementById('title-color').addEventListener('input', (e) => {
    window.appState.titleColor = e.target.value;
    const mainTitleEl = document.getElementById('main-title-text');
    if (mainTitleEl) mainTitleEl.style.color = e.target.value;
    window.saveDataToStorage();
});

// ĐỔI FONT CHỮ TIÊU ĐỀ CHÍNH
document.getElementById('btn-apply-title-font').addEventListener('click', (e) => {
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

document.getElementById('theme-color').addEventListener('input', (e) => {
    window.appState.themeColor = e.target.value;
    document.documentElement.style.setProperty('--primary', window.appState.themeColor);
    window.saveDataToStorage();
});

document.getElementById('text-color').addEventListener('input', (e) => {
    window.appState.textColor = e.target.value;
    document.documentElement.style.setProperty('--text-main', window.appState.textColor);
    window.saveDataToStorage();
});

document.getElementById('btn-apply-bg').addEventListener('click', (e) => {
    e.stopPropagation();
    const url = document.getElementById('custom-bg-input').value.trim();
    if (url) {
        window.appState.bgUrl = url;
        const videoEl = document.getElementById('bg-video');
        if (url.toLowerCase().endsWith('.mp4') || url.includes('.mp4?')) {
            videoEl.src = url; videoEl.classList.remove('hidden'); document.body.style.backgroundImage = "none";
        } else {
            videoEl.classList.add('hidden'); videoEl.src = ""; document.body.style.backgroundImage = `url('${url}')`;
        }
        document.getElementById('custom-bg-input').value = ''; window.saveDataToStorage();
    }
});

document.getElementById('gemini-key-input').addEventListener('input', (e) => {
    window.appState.geminiKey = e.target.value.trim(); window.saveDataToStorage();
});

document.getElementById('toggle-sound').addEventListener('change', (e) => {
    window.appState.soundEnabled = e.target.checked; window.saveDataToStorage();
});

document.getElementById('btn-reset-app').addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn xoá toàn bộ thói quen, mức tiền và tất cả cài đặt cá nhân không? Hành động này không thể hoàn tác.")) {
        localStorage.clear(); location.reload();
    }
});