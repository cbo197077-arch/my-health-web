const calGrid = document.getElementById('calendar-grid');
let completedDays = JSON.parse(localStorage.getItem('healing_skincare_days')) || [];

function renderCalendar() {
    calGrid.innerHTML = '';
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const today = now.getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (i === today) dayDiv.classList.add('today');
        if (completedDays.includes(i)) dayDiv.classList.add('completed');
        dayDiv.innerText = i;

        dayDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = completedDays.indexOf(i);
            if (index === -1) {
                completedDays.push(i); window.updateXP(15, e); window.playSound('success');
            } else {
                completedDays.splice(index, 1);
            }
            localStorage.setItem('healing_skincare_days', JSON.stringify(completedDays));
            renderCalendar();
        });
        calGrid.appendChild(dayDiv);
    }
}
renderCalendar();

// --- XỬ LÝ NHẬT KÝ & HIỂN THỊ TRỰC QUAN THEO TỪNG NGÀY ---
let currentMood = localStorage.getItem('healing_current_mood') || '';
const journalTextarea = document.getElementById('journal-text');
const savedLabel = document.getElementById('journal-saved-time');
const journalHistoryList = document.getElementById('journal-history-list');

let journalLogs = JSON.parse(localStorage.getItem('healing_journal_logs')) || [];

const moodStyles = {
    '🥰': { border: 'border-l-4 border-emerald-400 bg-emerald-500/5', label: 'Ngày Tràn Đầy Niềm Vui' },
    '⚡': { border: 'border-l-4 border-amber-400 bg-amber-500/5', label: 'Ngày Nhiều Năng Lượng' },
    '😴': { border: 'border-l-4 border-blue-400 bg-blue-500/5', label: 'Ngày Cần Được Nghỉ Ngơi' },
    '😵': { border: 'border-l-4 border-rose-400 bg-rose-500/5', label: 'Ngày Có Chút Mệt Mỏi' }
};

function renderJournalLogs() {
    if (!journalHistoryList) return;
    journalHistoryList.innerHTML = '';
    if (journalLogs.length === 0) {
        journalHistoryList.innerHTML = '<p class="text-[11px] italic opacity-50 text-center py-4">Ký ức tâm trạng hằng ngày đang trống...</p>';
        return;
    }
    
    [...journalLogs].reverse().forEach(log => {
        const div = document.createElement('div');
        const style = moodStyles[log.mood] || { border: 'border-l-4 border-primary bg-white/20', label: 'Ký ức chữa lành' };
        
        div.className = `glass-card p-3.5 flex gap-3.5 items-center ${style.border} transition-all duration-300 shadow-sm`;
        
        const dateParts = log.date.split(' - ');
        const time = dateParts[0] || '';
        const dateStr = dateParts[1] || '';
        
        div.innerHTML = `
            <div class="bg-white/80 rounded-xl px-2 py-1 text-center min-w-[56px] shrink-0 font-bold border border-black/5 shadow-inner">
                <div class="text-[7px] font-black opacity-40 uppercase tracking-widest">Thời gian</div>
                <div class="text-xs font-black text-gray-800">${dateStr}</div>
                <div class="text-[8px] opacity-50 font-semibold">${time}</div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                    <span class="text-lg">${log.mood || '🌿'}</span>
                    <span class="text-[10px] font-bold uppercase tracking-wider opacity-60">${style.label}</span>
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
        window.updateXP(10, e);
        renderJournalLogs();
        setTimeout(() => savedLabel.classList.add('hidden'), 2500);
    });
}

// THỂ DỤC ĐA CHỈ SỐ + HIỆU ỨNG CHÚC MỪNG SINH ĐỘNG
const fitnessList = document.getElementById('fitness-list');
const btnAddFit = document.getElementById('btn-add-fit');
const inputFit = document.getElementById('custom-fit-input');
const inputReps = document.getElementById('fit-reps-input');
const inputMins = document.getElementById('fit-mins-input');
let fitnessRoutines = JSON.parse(localStorage.getItem('healing_fitness_routines')) || [];

function renderFitness() {
    if (!fitnessList) return;
    fitnessList.innerHTML = '';
    if (fitnessRoutines.length === 0) {
        fitnessList.innerHTML = '<p class="text-xs italic text-center py-2 opacity-60">Chưa có lịch tập, hãy thêm bài tập đa thông số ở trên nha.</p>';
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
                window.updateXP(20, e);
                window.playSound('success');
                
                const popMsg = document.getElementById('celebration-msg');
                const popup = document.getElementById('celebration-popup');
                if (popMsg && popup) {
                    popMsg.innerText = `Tuyệt vời ông mặt trời! Bạn đã hoàn thành xuất sắc bài tập: "${fitnessRoutines[idx].name}" 🏃‍♂️💨`;
                    popup.classList.remove('hidden');
                }
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

// =========================================================================
// --- TÍNH NĂNG THỨ 6: SỔ TAY GHI CHÚ CHỮA LÀNH (ĐƯỢC THÊM MỚI ĐỘC LẬP) ---
// =========================================================================
const notesTextarea = document.getElementById('note-text');
const btnSaveNote = document.getElementById('btn-save-note');
const notesHistoryList = document.getElementById('notes-history-list');
let savedNotes = JSON.parse(localStorage.getItem('healing_notes')) || [];

function renderNotes() {
    if (!notesHistoryList) return;
    notesHistoryList.innerHTML = '';
    if (savedNotes.length === 0) {
        notesHistoryList.innerHTML = '<p class="text-[11px] italic opacity-50 text-center py-4">Chưa có ghi chú nào được lưu giữ...</p>';
        return;
    }
    
    // Đảo ngược mảng để note mới viết hiển thị lên đầu tiên của danh sách lịch sử
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

        savedNotes.push({
            text: textVal,
            date: timeStr
        });

        localStorage.setItem('healing_notes', JSON.stringify(savedNotes));
        notesTextarea.value = ''; // Xoá sạch khung nhập sau khi lưu
        window.updateXP(5, e); // Thưởng nhẹ 5 XP khuyến khích ghi chép chuyên cần
        renderNotes();
    });
}

// Khởi chạy đồng bộ tất cả danh sách khi tải ứng dụng
renderFitness();
renderJournalLogs();
renderNotes(); // Khởi chạy danh sách ghi chú