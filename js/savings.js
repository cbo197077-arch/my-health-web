const savingsList = document.getElementById('savings-list');
const btnAddGoal = document.getElementById('btn-add-goal');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const formTitle = document.getElementById('savings-form-title');
const editIndexField = document.getElementById('edit-goal-index');

const nameInput = document.getElementById('goal-name');
const targetInput = document.getElementById('goal-target');
const imgInput = document.getElementById('goal-img');

let goals = JSON.parse(localStorage.getItem('healing_savings_goals')) || [];

function renderGoals() {
    const lang = window.appState.language || 'vi';
    if (!savingsList) return;
    savingsList.innerHTML = '';
    
    goals.forEach((goal, index) => {
        const percent = Math.min(100, (goal.current / goal.target) * 100);
        const imageHTML = goal.img ? `<img src="${goal.img}" class="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm" onerror="this.src='https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=150'">` : '';
        
        let historyHTML = '';
        if (goal.history && goal.history.length > 0) {
            const histTitle = lang === 'en' ? 'Savings History:' : 'Lịch sử tích lũy:';
            historyHTML = `<div class="mt-2 text-[10px] text-gray-500 max-h-20 overflow-y-auto bg-black/5 p-2 rounded-lg">
                <div class="font-bold mb-1">${histTitle}</div>
                ${goal.history.map(h => `<div>• +${h.amount.toLocaleString()}đ (${h.date})</div>`).reverse().join('')}
            </div>`;
        }
        
        const remaining = goal.target - goal.current;
        const remainingText = remaining > 0 
            ? (lang === 'en' ? `Remaining: ${remaining.toLocaleString()}đ` : `Còn lại: ${remaining.toLocaleString()}đ`) 
            : (lang === 'en' ? 'Completed!' : 'Đã hoàn thành!');
            
        const btnAddText = lang === 'en' ? 'Add' : 'Cộng';
        const btnEditText = lang === 'en' ? 'Edit' : 'Sửa';
        const btnDelText = lang === 'en' ? 'Del' : 'Xóa';
        const placeholderText = lang === 'en' ? 'Add amount...' : 'Nhập số tiền...';

        const el = document.createElement('div');
        el.className = 'glass-card p-4 relative overflow-hidden';
        el.innerHTML = `
            <div class="flex gap-4 items-center mb-2">
                ${imageHTML}
                <div class="flex-1">
                    <div class="flex justify-between items-end mb-1">
                        <div class="font-bold text-sm">${goal.name}</div>
                        <div class="text-xs text-primary font-black">${Math.round(percent)}%</div>
                    </div>
                    <div class="text-[11px] font-bold opacity-70 mb-2">
                        ${goal.current.toLocaleString()}đ / ${goal.target.toLocaleString()}đ
                        <span class="text-rose-400 ml-1.5 font-black">(${remainingText})</span>
                    </div>
                    <div class="w-full h-2 bg-black/5 rounded-full overflow-hidden shadow-inner">
                        <div class="h-full bg-primary rounded-full transition-all" style="width: ${percent}%"></div>
                    </div>
                </div>
            </div>
            <div class="flex gap-1.5 mt-3 pt-2 border-t border-black/5">
                <input type="number" id="add-amount-${index}" placeholder="${placeholderText}" class="flex-1 p-2 text-xs rounded-xl glass-input font-bold">
                <button class="add-money bg-primary text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow" data-index="${index}">${btnAddText}</button>
                <button class="edit-goal bg-amber-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow" data-index="${index}">${btnEditText}</button>
                <button class="delete-goal bg-red-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow" data-index="${index}">${btnDelText}</button>
            </div>
            ${historyHTML}
        `;
        savingsList.appendChild(el);
    });
}

function resetForm() {
    nameInput.value = ''; targetInput.value = ''; imgInput.value = '';
    editIndexField.value = "-1";
    formTitle.innerHTML = `<i class="ph ph-piggy-bank text-primary text-2xl"></i> Tích Lũy Động Lực`;
    btnAddGoal.innerText = "Bắt Đầu Theo Dõi";
    btnCancelEdit.classList.add('hidden');
}

if (btnAddGoal) {
    btnAddGoal.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = nameInput.value.trim();
        const target = parseInt(targetInput.value);
        const img = imgInput.value.trim();
        const editIdx = parseInt(editIndexField.value);
        
        if (name && target) {
            if (editIdx === -1) {
                goals.push({ name, target, current: 0, img, history: [], celebrated: false });
            } else {
                goals[editIdx].name = name;
                goals[editIdx].target = target;
                goals[editIdx].img = img;
            }
            localStorage.setItem('healing_savings_goals', JSON.stringify(goals));
            resetForm(); renderGoals();
        }
    });
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', (e) => { e.stopPropagation(); resetForm(); });
}

if (savingsList) {
    savingsList.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetBtn = e.target;
        const indexStr = targetBtn.getAttribute('data-index');
        if (indexStr === null) return;
        const index = parseInt(indexStr);
        const goal = goals[index];

        if (targetBtn.classList.contains('add-money')) {
            const amount = parseInt(document.getElementById(`add-amount-${index}`).value);
            if (amount > 0) {
                goal.current += amount;
                if (!goal.history) goal.history = [];
                const now = new Date();
                const dateStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                goal.history.push({ amount, date: dateStr });
                
                if (goal.current >= goal.target && !goal.celebrated) {
                    goal.celebrated = true; window.playSound('success');
                    const celebMsg = document.getElementById('celebration-msg');
                    const celebPopup = document.getElementById('celebration-popup');
                    if (celebMsg && celebPopup) {
                        celebMsg.innerText = `Bạn đã tích lũy đủ số tiền cho mục tiêu "${goal.name}" rồi!`;
                        celebPopup.classList.remove('hidden');
                    }
                }
                localStorage.setItem('healing_savings_goals', JSON.stringify(goals));
                renderGoals();
            }
        }
        
        if (targetBtn.classList.contains('edit-goal')) {
            nameInput.value = goal.name;
            targetInput.value = goal.target;
            imgInput.value = goal.img || '';
            editIndexField.value = indexStr;
            formTitle.innerText = `Chỉnh Sửa Mục Tiêu`;
            btnAddGoal.innerText = "Cập Nhật";
            btnCancelEdit.classList.remove('hidden');
        }

        if (targetBtn.classList.contains('delete-goal')) {
            if(confirm(`Bạn muốn xóa mục tiêu "${goal.name}"?`)) {
                goals.splice(index, 1);
                localStorage.setItem('healing_savings_goals', JSON.stringify(goals));
                renderGoals();
            }
        }
    });
}

const closeCelebBtn = document.getElementById('btn-close-celebration');
if (closeCelebBtn) {
    closeCelebBtn.addEventListener('click', () => {
        const popup = document.getElementById('celebration-popup');
        if (popup) popup.classList.add('hidden');
    });
}

window.renderGoals = renderGoals;
renderGoals();

const aiChatBox = document.getElementById('ai-chat-box');
const aiChatInput = document.getElementById('ai-chat-input');
const btnSendAi = document.getElementById('btn-send-ai');
const btnGenRoutine = document.getElementById('btn-generate-routine');

async function askGeminiAI(message) {
    const apiKey = window.appState.geminiKey;
    if (!apiKey) return "⚠️ Bạn chưa cấu hình Gemini API Key trong tab Cài đặt nha!";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [{ 
                        text: `Bạn là trợ lý ảo chăm sóc sức khỏe, ăn uống và thói quen tên là AI Healing Buddy. Hãy trả lời thân thiện, ngắn gọn và súc tích (dưới 130 từ). Dùng icon dễ thương. 
                        ĐẶC BIỆT LƯU Ý VỀ TRÌNH BÀY ĐỂ TRÁNH BỊ RỐI MẮT: 
                        - Tuyệt đối không viết gộp tất cả nội dung thành một đoạn văn dài duy nhất.
                        - Bắt buộc phải xuống dòng rõ ràng giữa lời chào, các danh mục tư vấn và lời kết.
                        - Sử dụng dấu gạch đầu dòng (-) rõ ràng cho từng mục tiêu, in đậm tiêu đề của mục đó (Ví dụ: "- **Giấc ngủ:** ...").
                        Câu hỏi/Yêu cầu: ${message}` 
                    }] 
                }] 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return `❌ Google báo lỗi hệ thống: ${data.error ? data.error.message : 'Mã khóa Key không hợp lệ hoặc hết hạn sử dụng.'}`;
        }
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        return "⚠️ Không nhận được phản hồi phù hợp từ Buddy.";
    } catch (e) { 
        return `❌ Lỗi kết nối mạng: Trình duyệt chặn fetch hoặc thiết bị mất internet. (${e.message})`; 
    }
}

let aiChatHistory = JSON.parse(localStorage.getItem('healing_ai_chat_history')) || [];

function renderAiChatHistory() {
    if (!aiChatBox) return;
    const lang = window.appState.language || 'vi';
    const introText = lang === 'en'
        ? "I am your **AI Healing Buddy**! Enter your stats or chat with me! 🌟"
        : "Mình là **AI Healing Buddy** đây! Điền chỉ số hoặc trò chuyện với mình nhé! 🌟";
        
    aiChatBox.innerHTML = `<div class="bg-white p-3 rounded-2xl border border-white text-slate-700 shadow-sm leading-relaxed">${introText}</div>`;
    
    aiChatHistory.forEach(msg => {
        if (msg.sender === 'user') {
            aiChatBox.innerHTML += `<div class="bg-primary text-white p-2 rounded-2xl max-w-[85%] ml-auto text-xs border shadow-sm">${msg.text}</div>`;
        } else {
            aiChatBox.innerHTML += `<div class="bg-white/60 p-2 rounded-2xl max-w-[85%] text-xs border border-white shadow-inner">${msg.text}</div>`;
        }
    });
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
}

async function handleSendMessage(customText) {
    if (!aiChatBox) return;
    const text = customText || aiChatInput.value.trim(); if (!text) return;
    if(!customText && aiChatInput) aiChatInput.value = '';
    
    aiChatHistory.push({ sender: 'user', text: text });
    localStorage.setItem('healing_ai_chat_history', JSON.stringify(aiChatHistory));
    renderAiChatHistory();

    const loadingId = 'ai-loading-' + Date.now();
    aiChatBox.innerHTML += `<div id="${loadingId}" class="bg-white/40 p-2 rounded-2xl max-w-[85%] text-xs italic text-gray-500 animate-pulse border border-white">Buddy đang suy nghĩ...</div>`;
    aiChatBox.scrollTop = aiChatBox.scrollHeight;

    const aiResponse = await askGeminiAI(text);
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();
    
    const formattedResponse = aiResponse.replace(/\n/g, '<br>');
    aiChatHistory.push({ sender: 'buddy', text: formattedResponse });
    localStorage.setItem('healing_ai_chat_history', JSON.stringify(aiChatHistory));
    renderAiChatHistory();
}

if (btnSendAi) {
    btnSendAi.addEventListener('click', (e) => { e.stopPropagation(); handleSendMessage(); });
}
if (aiChatInput) {
    aiChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.stopPropagation(); handleSendMessage(); } });
}

if (btnGenRoutine) {
    btnGenRoutine.addEventListener('click', (e) => {
        e.stopPropagation();
        const h = document.getElementById('health-height').value;
        const w = document.getElementById('health-weight').value;
        const status = document.getElementById('health-status').value;
        const skin = document.getElementById('health-skin').value;
        if (!h || !w) { alert("Vui lòng điền Chiều cao và Cân nặng nha!"); return; }
        const promptText = `Mình cao ${h}cm, nặng ${w}kg. Tình trạng sức khỏe: ${status || 'Bình thường'}. Da dẻ: ${skin || 'Bình thường'}. Hãy lập cho mình một routine ngắn gọn, chữa lành.`;
        handleSendMessage(promptText);
    });
}

window.renderAiChatHistory = renderAiChatHistory;
renderAiChatHistory();