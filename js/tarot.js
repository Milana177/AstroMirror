// ТАРО (КАРТА ДНЯ И БИБЛИОТЕКА)

function checkAndRestoreCardOfDay() {
    console.log('checkAndRestoreCardOfDay вызван');
    if (!currentUser) {
        console.log('Нет пользователя');
        return;
    }
    const today = new Date().toDateString();
    const savedCard = localStorage.getItem(`cardOfDay_${currentUser.id}`);
    
    if (savedCard) {
        try {
            const cardData = JSON.parse(savedCard);
            if (cardData.date === today) {
                console.log('Восстанавливаем карту дня:', cardData.card.name);
                displayCardOfDay(cardData.card);
            } else {
                console.log('Сохраненная карта от другого дня');
            }
        } catch (e) {
            console.log('Ошибка восстановления карты дня:', e);
        }
    } else {
        console.log('Нет сохраненной карты дня');
    }
}

function displayCardOfDay(card) {
    const result = document.getElementById('tarotResult');
    if (!result) {
        console.log('Элемент tarotResult не найден');
        return;
    }
    
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
            <div class="card-of-day-image" style="font-size: 80px;">${card.image || '🎴'}</div>
            <div class="card-of-day-name">${card.name}</div>
            <div class="card-of-day-time">${dateStr}</div>
            <div class="card-of-day-message">${card.message || 'Прислушайтесь к себе сегодня'}</div>
            <div class="card-of-day-advice">💫 Совет дня: ${card.advice || 'Будьте внимательны'}</div>
            <div class="card-of-day-lucky">
                <span class="lucky-item">🎨 Цвет: ${card.luckyItem || 'Не указан'}</span>
                <span class="lucky-item">🔢 Число: ${card.luckyNumber || '?'}</span>
                <span class="lucky-item">🌪️ Стихия: ${card.element || '?'}</span>
            </div>
            <div class="card-of-day-warning">⚠️ ${card.warning || 'Будьте осторожны'}</div>
            <p style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5);">
                Карта дня показывается один раз в день. Приходите завтра за новой!
            </p>
        </div>
    `;
    result.classList.add('visible');
}

function getCardOfDay() {
    console.log('getCardOfDay вызван');
    
    if (!checkAuth()) {
        console.log('Пользователь не авторизован');
        return;
    }
    
    hideAllForms();
    
    const today = new Date().toDateString();
    const savedCard = localStorage.getItem(`cardOfDay_${currentUser.id}`);
    
    if (savedCard) {
        try {
            const cardData = JSON.parse(savedCard);
            if (cardData.date === today) {
                console.log('Карта дня уже есть на сегодня:', cardData.card.name);
                displayCardOfDay(cardData.card);
                return;
            }
        } catch (e) {
            console.log('Ошибка парсинга сохраненной карты:', e);
        }
    }
    
    // Проверяем, существует ли cardsOfDayDatabase
    if (typeof cardsOfDayDatabase === 'undefined') {
        console.error('cardsOfDayDatabase не определен!');
        alert('Ошибка загрузки базы карт. Обновите страницу.');
        return;
    }
    
    if (!cardsOfDayDatabase || cardsOfDayDatabase.length === 0) {
        console.error('cardsOfDayDatabase пуст!');
        alert('База карт не загружена');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * cardsOfDayDatabase.length);
    const selectedCard = cardsOfDayDatabase[randomIndex];
    
    console.log('Выбрана новая карта дня:', selectedCard.name);
    
    const cardData = {
        date: today,
        card: selectedCard
    };
    localStorage.setItem(`cardOfDay_${currentUser.id}`, JSON.stringify(cardData));
    
    displayCardOfDay(selectedCard);
    
    if (typeof saveToHistory === 'function') {
        saveToHistory('cardOfDay', { 
            card: selectedCard.name, 
            date: new Date().toLocaleDateString(),
            advice: selectedCard.advice
        });
    }
}

function showTarotLibrary() {
    if (!checkAuth()) return;
    hideAllForms();
    
    const result = document.getElementById('tarotResult');
    if (!result) return;
    
    if (typeof majorArcanaCards === 'undefined') {
        result.innerHTML = '<h3 style="color: #c0a0ff;">❌ Ошибка загрузки библиотеки карт</h3>';
        result.classList.add('visible');
        return;
    }
    
    result.innerHTML = `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">📚 Библиотека Таро</h3>
        <div id="tarotLibraryContent">
            ${renderMajorArcanaGrid()}
        </div>
    `;
    result.classList.add('visible');
}

function renderMajorArcanaGrid() {
    if (typeof majorArcanaCards === 'undefined') {
        return '<div class="empty-history">❌ Ошибка загрузки карт</div>';
    }
    
    return `
        <div class="tarot-grid">
            ${majorArcanaCards.map(card => `
                <div class="tarot-card" onclick="showCardMeaning('${card.name}', '${card.meaning}')">
                    <div class="tarot-card-image" style="font-size: 48px;">${card.image || '🎴'}</div>
                    <div class="tarot-card-name">${card.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function showCardMeaning(name, meaning) {
    alert(`🔮 ${name}\n\n${meaning}`);
}

console.log('tarot.js загружен');
