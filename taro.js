// ТАРО (КАРТА ДНЯ И БИБЛИОТЕКА)

function checkAndRestoreCardOfDay() {
    if (!currentUser) return;
    const today = new Date().toDateString();
    const savedCard = localStorage.getItem(`cardOfDay_${currentUser.id}`);
    
    if (savedCard) {
        try {
            const cardData = JSON.parse(savedCard);
            if (cardData.date === today) {
                displayCardOfDay(cardData.card);
            }
        } catch (e) {}
    }
}

function displayCardOfDay(card) {
    const result = document.getElementById('tarotResult');
    const today = new Date();
    const dateStr = today.toLocaleDateString('ru-RU', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    result.innerHTML = `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">🎴 Карта дня</h3>
        <div class="card-of-day">
            <div class="card-of-day-image">${card.image}</div>
            <div class="card-of-day-name">${card.name}</div>
            <div class="card-of-day-time">${dateStr}</div>
            
            <div class="card-of-day-message">${card.message}</div>
            
            <div class="card-of-day-advice">💫 Совет дня: ${card.advice}</div>
            
            <div class="card-of-day-lucky">
                <span class="lucky-item">🎨 Цвет: ${card.luckyItem.split(',')[0]}</span>
                <span class="lucky-item">🔢 Число: ${card.luckyNumber}</span>
                <span class="lucky-item">🌪️ Стихия: ${card.element}</span>
            </div>
            
            <div class="card-of-day-warning">⚠️ ${card.warning}</div>
            
            <p style="margin-top: 20px; font-size: 14px; color: rgba(255,255,255,0.5);">
                Карта дня показывается один раз в день. Приходите завтра за новой!
            </p>
        </div>
    `;
    result.classList.add('visible');
}

function getCardOfDay() {
    if (!checkAuth()) return;
    hideAllForms();
    
    const today = new Date().toDateString();
    const savedCard = localStorage.getItem(`cardOfDay_${currentUser.id}`);
    
    if (savedCard) {
        try {
            const cardData = JSON.parse(savedCard);
            if (cardData.date === today) {
                displayCardOfDay(cardData.card);
                return;
            }
        } catch (e) {}
    }
    
    const randomIndex = Math.floor(Math.random() * cardsOfDayDatabase.length);
    const selectedCard = cardsOfDayDatabase[randomIndex];
    
    const cardData = {
        date: today,
        card: selectedCard
    };
    localStorage.setItem(`cardOfDay_${currentUser.id}`, JSON.stringify(cardData));
    
    displayCardOfDay(selectedCard);
    saveToHistory('cardOfDay', { 
        card: selectedCard.name, 
        date: new Date().toLocaleDateString(),
        advice: selectedCard.advice
    });
}

function showTarotLibrary() {
    if (!checkAuth()) return;
    hideAllForms();
    
    const result = document.getElementById('tarotResult');
    result.innerHTML = `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">📚 Библиотека Таро</h3>
        <div style="margin-bottom: 20px; display: flex; gap: 10px; justify-content: center;">
        </div>
        <div id="tarotLibraryContent">
            ${renderMajorArcanaGrid()}
        </div>
    `;
    result.classList.add('visible');
}

function renderMajorArcanaGrid() {
    return `
        <div class="tarot-grid">
            ${majorArcanaCards.map(card => `
                <div class="tarot-card" onclick="showCardMeaning('${card.name}', '${card.meaning}')">
                    <div class="tarot-card-image">${card.image || '🎴'}</div>
                    <div class="tarot-card-name">${card.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function showCardMeaning(name, meaning) {
    alert(`🔮 ${name}\n\n${meaning}`);
}