// ИСТОРИЯ РАСЧЕТОВ

function saveToHistory(type, data) {
    if (!currentUser) return;
    const history = JSON.parse(localStorage.getItem('astroHistory_' + currentUser.id) || '[]');
    history.push({
        type: type,
        data: data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('astroHistory_' + currentUser.id, JSON.stringify(history));
}

function showHistory() {
    if (!checkAuth()) return;
    hideAllForms();
    
    const historyContainer = document.getElementById('historyContainer');
    const historyContent = document.getElementById('historyContent');
    
    const history = JSON.parse(localStorage.getItem('astroHistory_' + currentUser.id) || '[]');
    
    if (history.length === 0) {
        historyContent.innerHTML = '<div class="empty-history">📜 История пуста. Сделайте первый расчет или гадание!</div>';
    } else {
        historyContent.innerHTML = history.reverse().map((item, index) => {
            const date = new Date(item.timestamp).toLocaleString('ru-RU');
            let typeLabel = '';
            let contentHtml = '';
            
            switch (item.type) {
                case 'matrix':
                    typeLabel = '🔮 Матрица судьбы';
                    contentHtml = `
                        <strong>${item.data.name || currentUser.name}</strong><br>
                        Аркан рождения: ${item.data.birthArcane}<br>
                        Аркан судьбы: ${item.data.destinyArcane}<br>
                        Аркан таланта: ${item.data.talentArcane}
                    `;
                    break;
                case 'cardOfDay':
                    typeLabel = '🎴 Карта дня';
                    contentHtml = `
                        <strong>${item.data.card}</strong><br>
                        ${item.data.date}<br>
                        Совет: ${item.data.advice}
                    `;
                    break;
                case 'majorArcana':
                    typeLabel = '🎴 Расклад "3 карты"';
                    contentHtml = `
                        <strong>Вопрос:</strong> "${item.data.question}"<br>
                        <strong>Карты:</strong> ${item.data.cards.join(' → ')}<br>
                        <strong>Ответ:</strong> ${item.data.answer.substring(0, 100)}...
                    `;
                    break;
                default:
                    typeLabel = '📜 Запись';
                    contentHtml = JSON.stringify(item.data);
            }
            
            return `
                <div class="history-item">
                    <div class="history-date">${date}</div>
                    <div class="history-type">${typeLabel}</div>
                    <div class="history-content">${contentHtml}</div>
                </div>
            `;
        }).join('');
    }
    
    historyContainer.style.display = 'block';
    historyContainer.classList.add('visible');
}

function clearHistory() {
    if (!currentUser) return;
    if (confirm('Вы уверены, что хотите очистить всю историю? Это действие нельзя отменить.')) {
        localStorage.removeItem('astroHistory_' + currentUser.id);
        showHistory(); // Обновляем отображение
        alert('История очищена');
    }
}