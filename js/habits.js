const calGrid = document.getElementById('calendar-grid');
let completedDays = JSON.parse(localStorage.getItem('healing_skincare_days')) || [];

const streakCounter = document.getElementById('streak-counter');
const completionPercent = document.getElementById('completion-percent');
const completionFraction = document.getElementById('completion-fraction');
const monthDisplay = document.getElementById('current-month-display');
const skincareNotes = document.getElementById('skincare-notes');

if (skincareNotes) {
    skincareNotes.value = localStorage.getItem('healing_skincare_notes') || '';
    skincareNotes.addEventListener('input', (e) => {
        localStorage.setItem('healing_skincare_notes', e.target.value);
    });
}

// HÀM TÍNH TOÁN STREAK MỚI: Trả về chuỗi ngày liên tiếp dài nhất cực chuẩn
function calculateStreak(daysArray) {
    if (!daysArray || daysArray.length === 0) return 0;
    let sortedDays = [...new Set(daysArray)].sort((a,b) => a-b);
    let maxStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
        if (sortedDays[i] === sortedDays[i-1] + 1) {
            currentStreak++;
        } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
        }
    }
    return Math.max(maxStreak, currentStreak);
}

function renderCalendar() {
    if (!calGrid) return;
    calGrid.innerHTML = '';
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const daysInMonth = new Date(now.getFullYear(), currentMonth, 0).getDate();
    const today = now.getDate();

    const monthStr = window.appState.language === 'en' ? 'Month' : 'Tháng';
    if (monthDisplay) monthDisplay.innerText = `${monthStr} ${currentMonth}`;
    const todayStr = window.appState.language === 'en' ? 'Today' : 'Hôm nay';

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (i === today) {
            dayDiv.classList.add('today');
            dayDiv.setAttribute('data-today', todayStr);
        }
        if (completedDays.includes(i)) dayDiv.classList.add('completed');
        dayDiv.innerText = i;

        dayDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = completedDays.indexOf(i);
            
            if (index === -1) {
                completedDays.push(i); 
                if (window.updateXP) window.updateXP(15, e); 
                if (window.playSound) window.playSound('success');
            } else {
                completedDays.splice(index, 1);
                if (window.updateXP) window.updateXP(-15, null); 
            }
            localStorage.setItem('healing_skincare_days', JSON.stringify(completedDays));
            renderCalendar();
        });
        calGrid.appendChild(dayDiv);
    }

    let streak = calculateStreak(completedDays);
    const streakStr = window.appState.language === 'en' ? 'days streak' : 'ngày liên tiếp';
    
    if (streakCounter) {
        streakCounter.innerHTML = `<i class="ph-fill ph-fire text-orange-400"></i> ${streak} ${streakStr}`;
        if (streak >= 3) {
            streakCounter.classList.replace('text-orange-500', 'text-red-500');
            streakCounter.classList.replace('bg-orange-50', 'bg-red-50');
        } else {
            streakCounter.classList.replace('text-red-500', 'text-orange-500');
            streakCounter.classList.replace('bg-red-50', 'bg-orange-50');
        }
    }

    const completedCount = completedDays.length;
    const percent = Math.round((completedCount / daysInMonth) * 100) || 0;
    
    const completedStr = window.appState.language === 'en' ? 'Completed' : 'Hoàn thành';
    if (completionPercent) completionPercent.innerText = `${percent}%`;
    if (completionFraction) completionFraction.innerHTML = `<span data-i18n="completed">${completedStr}</span><br><span class="text-[11px] font-bold text-slate-700 block">${completedCount}/${daysInMonth}</span>`;
}

let customHabits = JSON.parse(localStorage.getItem('healing_custom_habits')) || [];

function renderCustomHabits() {
    const container = document.getElementById('custom-habits-container');
    if (!container) return;
    container.innerHTML = '';
    
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();

    const monthStr = window.appState.language === 'en' ? 'Month' : 'Tháng';
    const todayStr = window.appState.language === 'en' ? 'Today' : 'Hôm nay';
    const completedStr = window.appState.language === 'en' ? 'Completed' : 'Hoàn thành';
    
    // Dict dịch T2-CN
    const dMon = window.appState.language === 'en' ? 'Mon' : 'T2';
    const dTue = window.appState.language === 'en' ? 'Tue' : 'T3';
    const dWed = window.appState.language === 'en' ? 'Wed' : 'T4';
    const dThu = window.appState.language === 'en' ? 'Thu' : 'T5';
    const dFri = window.appState.language === 'en' ? 'Fri' : 'T6';
    const dSat = window.appState.language === 'en' ? 'Sat' : 'T7';
    const dSun = window.appState.language === 'en' ? 'Sun' : 'CN';

    customHabits.forEach((habit, hIndex) => {
        habit.days = habit.days || []; // Fallback tránh kẹt array rỗng gây đơ web
        const isPinned = habit.isPinned || false;
        const isExpanded = habit.isExpanded !== false; 

        let streak = calculateStreak(habit.days);
        const percent = Math.round((habit.days.length / daysInMonth) * 100) || 0;

        const card = document.createElement('div');
        card.className = `bg-white/40 p-5 rounded-[20px] border ${isPinned ? 'border-indigo-400 shadow-md' : 'border-white/60 shadow-sm'} relative flex flex-col transition-all duration-300`;
        card.style.order = isPinned ? '-1' : '0';

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="font-bold text-[15px] text-slate-800 uppercase flex items-center gap-1.5">
                    <button class="toggle-pin text-lg ${isPinned ? 'text-indigo-500' : 'text-gray-400 hover:text-indigo-500'} transition-colors" data-index="${hIndex}" title="Ghim">
                        <i class="${isPinned ? 'ph-fill' : 'ph'} ph-push-pin"></i>
                    </button>
                    ${habit.name}
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-100">
                        <i class="ph-fill ph-fire text-orange-400"></i> ${streak}
                    </span>
                    <button class="text-gray-400 hover:text-indigo-500 toggle-expand transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}" data-index="${hIndex}">
                        <i class="ph ph-caret-up text-lg"></i>
                    </button>
                    <button class="text-gray-400 hover:text-red-500 delete-custom-habit ml-0.5" data-index="${hIndex}">
                        <i class="ph ph-trash text-base"></i>
                    </button>
                </div>
            </div>
            
            <div class="habit-body transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}">
                <div class="flex gap-4 relative z-20">
                    <div class="flex-1">
                        <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-500 mb-3">
                            <div>${dMon}</div><div>${dTue}</div><div>${dWed}</div><div>${dThu}</div><div>${dFri}</div><div>${dSat}</div><div>${dSun}</div>
                        </div>
                        <div class="grid grid-cols-7 gap-y-5 gap-x-1 text-center relative z-20" id="custom-grid-${hIndex}"></div>
                    </div>
                    
                    <div class="w-[110px] shrink-0 bg-white/50 border border-white rounded-[20px] p-3 shadow-[inset_0_2px_10px_rgba(255,255,255,1)] flex flex-col justify-center">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-xs font-bold text-slate-700">${monthStr} ${now.getMonth() + 1}</span>
                            <i class="ph-fill ph-leaf text-emerald-400 text-base"></i>
                        </div>
                        <div class="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-white">
                            <div class="w-[34px] h-[34px] rounded-full border-[3px] border-emerald-400 flex items-center justify-center text-[9px] font-bold text-emerald-600 shrink-0">${percent}%</div>
                            <div class="text-[8px] text-gray-500 font-medium leading-tight">${completedStr}<br><span class="text-[10px] font-bold text-slate-700 block">${habit.days.length}/${daysInMonth}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);

        if (isExpanded) {
            const grid = document.getElementById(`custom-grid-${hIndex}`);
            for (let i = 1; i <= daysInMonth; i++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day !w-8 !h-8 text-xs'; 
                if (i === today) {
                    dayDiv.classList.add('today');
                    dayDiv.setAttribute('data-today', todayStr);
                }
                if (habit.days.includes(i)) dayDiv.classList.add('completed');
                dayDiv.innerText = i;

                dayDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = habit.days.indexOf(i);
                    
                    if (index === -1) {
                        habit.days.push(i);
                        if(window.updateXP) window.updateXP(15, e);
                        if(window.playSound) window.playSound('success');
                    } else {
                        habit.days.splice(index, 1);
                        if(window.updateXP) window.updateXP(-15, null);
                    }
                    localStorage.setItem('healing_custom_habits', JSON.stringify(customHabits));
                    renderCustomHabits(); 
                });
                grid.appendChild(dayDiv);
            }
        }
    });

    document.querySelectorAll('.toggle-pin').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = btn.getAttribute('data-index');
            customHabits[idx].isPinned = !customHabits[idx].isPinned;
            localStorage.setItem('healing_custom_habits', JSON.stringify(customHabits));
            renderCustomHabits();
        });
    });

    document.querySelectorAll('.toggle-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = btn.getAttribute('data-index');
            customHabits[idx].isExpanded = customHabits[idx].isExpanded === false ? true : false;
            localStorage.setItem('healing_custom_habits', JSON.stringify(customHabits));
            renderCustomHabits();
        });
    });

    document.querySelectorAll('.delete-custom-habit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(confirm('Bạn có chắc chắn muốn xóa thói quen này và toàn bộ lịch sử điểm danh của nó không?')) {
                const idx = btn.getAttribute('data-index');
                customHabits.splice(idx, 1);
                localStorage.setItem('healing_custom_habits', JSON.stringify(customHabits));
                renderCustomHabits();
            }
        });
    });
}

const btnAddHabit = document.getElementById('btn-add-custom-habit');
const inputHabit = document.getElementById('new-custom-habit-input');
if (btnAddHabit) {
    btnAddHabit.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = inputHabit.value.trim();
        if (val) {
            customHabits.push({ name: val, days: [], isPinned: false, isExpanded: true });
            inputHabit.value = '';
            localStorage.setItem('healing_custom_habits', JSON.stringify(customHabits));
            renderCustomHabits();
        }
    });
}

let currentMood = localStorage.getItem('healing_current_mood') || '';
const journalTextarea = document.getElementById('journal-text');
const savedLabel = document.getElementById('journal-saved-time');
const journalHistoryList = document.getElementById('journal-history-list');

let journalLogs = JSON.parse(localStorage.getItem('healing_journal_logs')) || [];

const moodStyles = {
    '😊': { border: 'border-l-4 border-emerald-400 bg-emerald-500/5', label_vi: 'Ngày Tràn Đầy Niềm Vui', label_en: 'Joyful Day' },
    '😭': { border: 'border-l-4 border-blue-400 bg-blue-500/5', label_vi: 'Ngày Rơi Nước Mắt', label_en: 'Tearful Day' },
    '😡': { border: 'border-l-4 border-rose-500 bg-rose-500/5', label_vi: 'Ngày Tức Giận', label_en: 'Angry Day' },
    '😨': { border: 'border-l-4 border-purple-400 bg-purple-500/5', label_vi: 'Ngày Sợ Hãi', label_en: 'Fearful Day' }
};

function renderJournalLogs() {
    const lang = window.appState.language || 'vi';
    if (!journalHistoryList) return;
    journalHistoryList.innerHTML = '';
    
    if (journalLogs.length === 0) {
        const emptyStr = lang === 'en' ? 'Daily emotion memories are empty...' : 'Ký ức tâm trạng hằng ngày đang trống...';
        journalHistoryList.innerHTML = `<p class="text-[11px] italic opacity-50 text-center py-4">${emptyStr}</p>`;
        return;
    }
    
    const timeLabel = lang === 'en' ? 'Time' : 'Thời gian';

    [...journalLogs].reverse().forEach(log => {
        const div = document.createElement('div');
        const style = moodStyles[log.mood] || { border: 'border-l-4 border-primary bg-white/20', label_vi: 'Ký ức chữa lành', label_en: 'Healing Memory' };
        const labelStr = lang === 'en' ? style.label_en : style.label_vi;
        
        div.className = `glass-card p-3.5 flex gap-3.5 items-center ${style.border} transition-all duration-300 shadow-sm`;
        
        const dateParts = log.date.split(' - ');
        const time = dateParts[0] || '';
        const dateStr = dateParts[1] || '';
        
        div.innerHTML = `
            <div class="bg-white/80 rounded-xl px-2 py-1 text-center min-w-[56px] shrink-0 font-bold border border-black/5 shadow-inner">
                <div class="text-[7px] font-black opacity-40 uppercase tracking-widest">${timeLabel}</div>
                <div class="text-xs font-black text-gray-800">${dateStr}</div>
                <div class="text-[8px] opacity-50 font-semibold">${time}</div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                    <span class="text-lg">${log.mood || '🌿'}</span>
                    <span class="text-[10px] font-bold uppercase tracking-wider opacity-60">${labelStr}</span>
                </div>
                <div class="font-bold text-xs mt-1 leading-relaxed text-current break-words bg-white/10 p-2 rounded-lg border border-white/20 shadow-inner">
                    ${log.text}
                </div>
            </div>
        `;
        journalHistoryList.appendChild(div);
    });
}

document.querySelectorAll('.mood-btn').forEach(btn => {
    if(btn.getAttribute('data-mood') === currentMood) btn.classList.add('active');
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        currentMood = e.currentTarget.getAttribute('data-mood');
        e.currentTarget.classList.add('active');
        localStorage.setItem('healing_current_mood', currentMood);
    });
});

if (document.getElementById('btn-save-journal')) {
    document.getElementById('btn-save-journal').addEventListener('click', (e) => {
        e.stopPropagation();
        const textVal = journalTextarea.value.trim();
        if (!textVal) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

        journalLogs.push({
            mood: currentMood || '🌿',
            text: textVal,
            date: timeStr
        });

        localStorage.setItem('healing_journal_logs', JSON.stringify(journalLogs));
        journalTextarea.value = '';
        savedLabel.classList.remove('hidden');
        if(window.updateXP) window.updateXP(10, e);
        renderJournalLogs();
        setTimeout(() => savedLabel.classList.add('hidden'), 2500);

        if (['😭', '😡', '😨'].includes(currentMood)) {
            const healingPopup = document.getElementById('healing-popup');
            if (healingPopup) {
                healingPopup.classList.remove('hidden');
                if(window.playSound) window.playSound('click'); 
            }
        }
    });
}

const btnCloseHealing = document.getElementById('btn-close-healing');
if (btnCloseHealing) {
    btnCloseHealing.addEventListener('click', () => {
        document.getElementById('healing-popup').classList.add('hidden');
    });
}

const btnChatCun = document.getElementById('btn-chat-cun');
if (btnChatCun) {
    btnChatCun.addEventListener('click', () => {
        document.getElementById('healing-popup').classList.add('hidden');
        const cunSection = document.getElementById('cun-chat-section');
        if (cunSection) {
            cunSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { document.getElementById('cun-chat-input').focus(); }, 600);
        }
    });
}

const cunChatBox = document.getElementById('cun-chat-box');
const cunChatInput = document.getElementById('cun-chat-input');
const btnSendCun = document.getElementById('btn-send-cun');

async function askCunAI(message) {
    const apiKey = window.appState ? window.appState.geminiKey : '';
    if (!apiKey) return "Gâu gâu! 🐶 Cậu chưa dán Mã API Key trong phần Cài đặt kìa!";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ 
                    parts: [{ 
                        text: `Bạn là một chú chó Corgi tên Cún, chuyên gia thấu hiểu tâm lý. Hãy trả lời cực kỳ đáng yêu, dỗ dành, súc tích (dưới 100 từ). Dùng các từ như "gâu gâu", "ư ử", "vẫy đuôi", "liếm mặt" và emoji. Tâm sự: ${message}` 
                    }] 
                }] 
            })
        });
        
        const data = await response.json();
        if (!response.ok) return `🐶 Ư ử... Lỗi hệ thống: ${data.error ? data.error.message : 'Key hỏng rồi cậu ơi.'}`;
        if (data.candidates && data.candidates[0].content.parts[0].text) return data.candidates[0].content.parts[0].text;
        
        return "🐶 Cún không nghe rõ cậu nói gì...";
    } catch (e) { 
        return `🐶 Gâu gâu! Mạng nhà mình rớt rồi cậu ơi!`; 
    }
}

async function handleSendCun() {
    if (!cunChatBox) return;
    const text = cunChatInput.value.trim(); if (!text) return;
    cunChatInput.value = '';
    
    cunChatBox.innerHTML += `<div class="bg-amber-500 text-white p-2 rounded-2xl max-w-[85%] ml-auto text-xs border shadow-sm">${text}</div>`;
    cunChatBox.scrollTop = cunChatBox.scrollHeight;

    const loadingId = 'cun-loading-' + Date.now();
    cunChatBox.innerHTML += `<div id="${loadingId}" class="bg-amber-100 p-2 rounded-2xl max-w-[85%] text-xs italic text-amber-700 animate-pulse border border-amber-200 shadow-sm">Cún đang vểnh tai nghe... 🐶</div>`;
    cunChatBox.scrollTop = cunChatBox.scrollHeight;

    const aiResponse = await askCunAI(text);
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) loadingEl.remove();
    
    const formattedResponse = aiResponse.replace(/\n/g, '<br>');
    cunChatBox.innerHTML += `<div class="bg-white/90 p-2.5 rounded-2xl max-w-[85%] text-xs font-medium border border-amber-200 shadow-inner text-amber-900 leading-relaxed">${formattedResponse}</div>`;
    cunChatBox.scrollTop = cunChatBox.scrollHeight;
    
    if(window.updateXP) window.updateXP(5);
}

if (btnSendCun) { btnSendCun.addEventListener('click', (e) => { e.stopPropagation(); handleSendCun(); }); }
if (cunChatInput) { cunChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.stopPropagation(); handleSendCun(); } }); }

const fitnessList = document.getElementById('fitness-list');
const btnAddFit = document.getElementById('btn-add-fit');
const inputFit = document.getElementById('custom-fit-input');
const inputReps = document.getElementById('fit-reps-input');
const inputMins = document.getElementById('fit-mins-input');
let fitnessRoutines = JSON.parse(localStorage.getItem('healing_fitness_routines')) || [];

function renderFitness() {
    const lang = window.appState.language || 'vi';
    if (!fitnessList) return;
    fitnessList.innerHTML = '';
    
    if (fitnessRoutines.length === 0) {
        const emptyStr = lang === 'en' ? 'No fitness routines, please add one above.' : 'Chưa có lịch tập, hãy thêm bài tập đa thông số ở trên nha.';
        fitnessList.innerHTML = `<p class="text-xs italic text-center py-2 opacity-60">${emptyStr}</p>`;
        return;
    }
    
    fitnessRoutines.forEach((fit, index) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white/40 p-3 rounded-xl border border-white/60 hover:bg-white/70 transition-colors';
        const repsText = fit.reps ? `${fit.reps} cái` : '';
        const minsText = fit.mins ? `${fit.mins} phút` : '';
        const detailText = [repsText, minsText].filter(Boolean).join(' • ');

        div.innerHTML = `
            <div>
                <span class="text-sm font-bold block">${fit.name}</span>
                ${detailText ? `<span class="text-[11px] font-bold text-primary">${detailText}</span>` : ''}
            </div>
            <div class="flex items-center gap-3">
                <input type="checkbox" class="habit-checkbox fitness-check" data-index="${index}" ${fit.done ? 'checked' : ''}>
                <button class="text-gray-400 hover:text-red-500 delete-fit font-bold text-xs" data-index="${index}"><i class="ph ph-trash text-lg pointer-events-none"></i></button>
            </div>
        `;
        fitnessList.appendChild(div);
    });

    document.querySelectorAll('.fitness-check').forEach(box => {
        box.addEventListener('change', (e) => {
            e.stopPropagation();
            const idx = parseInt(e.target.getAttribute('data-index'));
            fitnessRoutines[idx].done = e.target.checked;
            
            if (e.target.checked) {
                if(window.updateXP) window.updateXP(20, e);
                if(window.playSound) window.playSound('success');
                
                const popMsg = document.getElementById('celebration-msg');
                const popup = document.getElementById('celebration-popup');
                if (popMsg && popup) {
                    popMsg.innerText = `Tuyệt vời ông mặt trời! Bạn đã hoàn thành xuất sắc bài tập: "${fitnessRoutines[idx].name}" 🏃‍♂️💨`;
                    popup.classList.remove('hidden');
                }
            } else {
                if(window.updateXP) window.updateXP(-20, null);
            }
            localStorage.setItem('healing_fitness_routines', JSON.stringify(fitnessRoutines));
        });
    });

    document.querySelectorAll('.delete-fit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            fitnessRoutines.splice(btn.getAttribute('data-index'), 1);
            localStorage.setItem('healing_fitness_routines', JSON.stringify(fitnessRoutines));
            renderFitness();
        });
    });
}

if (btnAddFit) {
    btnAddFit.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = inputFit.value.trim();
        if (val) {
            fitnessRoutines.push({
                name: val,
                reps: inputReps.value ? parseInt(inputReps.value) : null,
                mins: inputMins.value ? parseInt(inputMins.value) : null,
                done: false
            });
            inputFit.value = ''; inputReps.value = ''; inputMins.value = '';
            localStorage.setItem('healing_fitness_routines', JSON.stringify(fitnessRoutines));
            renderFitness();
        }
    });
}

const notesTextarea = document.getElementById('note-text');
const btnSaveNote = document.getElementById('btn-save-note');
const notesHistoryList = document.getElementById('notes-history-list');
let savedNotes = JSON.parse(localStorage.getItem('healing_notes')) || [];

function renderNotes() {
    const lang = window.appState.language || 'vi';
    if (!notesHistoryList) return;
    notesHistoryList.innerHTML = '';
    
    if (savedNotes.length === 0) {
        const emptyStr = lang === 'en' ? 'No notes saved yet...' : 'Chưa có ghi chú nào được lưu giữ...';
        notesHistoryList.innerHTML = `<p class="text-[11px] italic opacity-50 text-center py-4">${emptyStr}</p>`;
        return;
    }
    
    [...savedNotes].reverse().forEach((note, index) => {
        const actualIndex = savedNotes.length - 1 - index;
        const div = document.createElement('div');
        div.className = 'glass-card p-3 flex justify-between items-start bg-white/30 border border-white/40 shadow-sm gap-2 animate-fade-in';
        div.innerHTML = `
            <div class="flex-1 min-w-0">
                <div class="text-[9px] font-bold opacity-50 mb-1"><i class="ph ph-calendar-blank"></i> ${note.date}</div>
                <div class="font-semibold text-xs leading-relaxed text-current break-words whitespace-pre-line">${note.text}</div>
            </div>
            <button class="text-gray-400 hover:text-red-500 delete-note shrink-0 pt-0.5" data-index="${actualIndex}">
                <i class="ph ph-trash text-base pointer-events-none"></i>
            </button>
        `;
        notesHistoryList.appendChild(div);
    });

    document.querySelectorAll('.delete-note').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute('data-index'));
            if (confirm('Bạn có chắc chắn muốn xóa dòng ghi chú này không?')) {
                savedNotes.splice(idx, 1);
                localStorage.setItem('healing_notes', JSON.stringify(savedNotes));
                renderNotes();
            }
        });
    });
}

if (btnSaveNote) {
    btnSaveNote.addEventListener('click', (e) => {
        e.stopPropagation();
        const textVal = notesTextarea.value.trim();
        if (!textVal) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

        savedNotes.push({ text: textVal, date: timeStr });

        localStorage.setItem('healing_notes', JSON.stringify(savedNotes));
        notesTextarea.value = ''; 
        if(window.updateXP) window.updateXP(5, e); 
        renderNotes();
    });
}

// Gán biến ra toàn cục để app.js (hàm applyLanguage) có thể gọi lại và vẽ DOM theo ngôn ngữ
window.renderCalendar = renderCalendar;
window.renderCustomHabits = renderCustomHabits;
window.renderFitness = renderFitness;
window.renderJournalLogs = renderJournalLogs;
window.renderNotes = renderNotes;

renderCalendar();
renderCustomHabits();
renderFitness();
renderJournalLogs();
renderNotes();