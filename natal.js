// НАТАЛЬНАЯ АСТРОЛОГИЯ

function showNatalForm() {
    if (!checkAuth()) return;
    hideAllForms();
    document.getElementById('natalFormContainer').style.display = 'block';
    updatePartnerFields();
}

function updatePartnerFields() {
    const selectedRadio = document.querySelector('input[name="calcType"]:checked');
    if (selectedRadio) {
        const selectedType = selectedRadio.value;
        const partnerFields = document.getElementById('partnerFields');
        if (partnerFields) {
            partnerFields.style.display = selectedType === 'synastry' ? 'block' : 'none';
        }
    }
}

function calculateAstrology() {
    const name = document.getElementById('natalName').value || currentUser?.name || 'Аноним';
    const date = document.getElementById('natalDate').value;
    const time = document.getElementById('natalTime').value;
    const place = document.getElementById('natalPlace').value;
    const calcType = document.querySelector('input[name="calcType"]:checked')?.value || 'natal';
    
    if (!date) {
        alert('Пожалуйста, введите дату рождения');
        return;
    }
    
    const resultDiv = document.getElementById('natalResult');
    const tabs = document.getElementById('resultTabs');
    const natalTab = document.getElementById('natalTabContent');
    const transitsTab = document.getElementById('transitsTabContent');
    const synastryTab = document.getElementById('synastryTabContent');
    
    // Показываем результат
    resultDiv.classList.add('visible');
    tabs.style.display = 'flex';
    
    // Заполняем вкладки
    if (calcType === 'natal') {
        natalTab.innerHTML = generateNatalResult(name, date, time, place);
        transitsTab.innerHTML = '';
        synastryTab.innerHTML = '';
        showResultTab('natal');
    } else if (calcType === 'transits') {
        transitsTab.innerHTML = generateTransitsResult(name, date);
        natalTab.innerHTML = '';
        synastryTab.innerHTML = '';
        showResultTab('transits');
    } else if (calcType === 'synastry') {
        const partnerName = document.getElementById('partnerName').value || 'Партнер';
        const partnerDate = document.getElementById('partnerDate').value;
        const partnerTime = document.getElementById('partnerTime').value;
        const partnerPlace = document.getElementById('partnerPlace').value;
        
        if (!partnerDate) {
            alert('Пожалуйста, введите дату рождения партнера');
            return;
        }
        
        synastryTab.innerHTML = generateSynastryResult(name, date, partnerName, partnerDate);
        natalTab.innerHTML = '';
        transitsTab.innerHTML = '';
        showResultTab('synastry');
    }
    
    // Сохраняем в историю
    saveToHistory('natal', { 
        name, 
        date, 
        time, 
        place, 
        calcType,
        partnerName: calcType === 'synastry' ? document.getElementById('partnerName')?.value : null
    });
}

function generateNatalResult(name, date, time, place) {
    const [year, month, day] = date.split('-').map(Number);
    const zodiac = getZodiacSign(month, day);
    const element = getElementByZodiac(zodiac);
    
    return `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">🌙 Натальная карта ${name}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px;">
                <div style="color: #c0a0ff;">📅 Дата рождения</div>
                <div>${date} ${time ? 'в ' + time : ''}</div>
                <div style="margin-top: 10px;">📍 ${place || 'не указано'}</div>
            </div>
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px;">
                <div style="color: #c0a0ff;">⭐ Солнечный знак</div>
                <div style="font-size: 24px;">${zodiac}</div>
                <div>Стихия: ${element}</div>
            </div>
        </div>
        
        <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
            <h4 style="color: #c0a0ff;">✨ Краткий астрологический портрет</h4>
            <p style="margin-top: 10px;">${getZodiacDescription(zodiac)}</p>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5); text-align: center;">
            ⚠️ Полная версия натальной карты с расчетом домов, планет и аспектов будет доступна в следующей версии
        </p>
    `;
}

function generateTransitsResult(name, date) {
    const today = new Date();
    const todayStr = today.toLocaleDateString('ru-RU');
    
    return `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">⭐ Транзиты на ${todayStr}</h3>
        
        <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
            <h4 style="color: #c0a0ff;">🌙 Луна сегодня</h4>
            <p>Луна в знаке ${getMoonSign(today)}</p>
        </div>
        
        <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px; margin-top: 15px;">
            <h4 style="color: #c0a0ff;">✨ Аспекты дня</h4>
            <p>${getDailyAspects()}</p>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5); text-align: center;">
            ⚠️ Полная версия транзитов с персональными аспектами будет доступна в следующей версии
        </p>
    `;
}

function generateSynastryResult(name1, date1, name2, date2) {
    const [year1, month1, day1] = date1.split('-').map(Number);
    const [year2, month2, day2] = date2.split('-').map(Number);
    
    const zodiac1 = getZodiacSign(month1, day1);
    const zodiac2 = getZodiacSign(month2, day2);
    
    const compatibility = getCompatibility(zodiac1, zodiac2);
    
    return `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">💞 Синастрия: ${name1} и ${name2}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px;">${zodiac1}</div>
                <div>${name1}</div>
            </div>
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px;">${zodiac2}</div>
                <div>${name2}</div>
            </div>
        </div>
        
        <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
            <h4 style="color: #c0a0ff;">🔮 Совместимость знаков</h4>
            <p style="font-size: 18px; text-align: center; margin: 15px 0;">${compatibility.score}%</p>
            <p>${compatibility.description}</p>
        </div>
        
        <div style="background: rgba(192,160,255,0.1); padding: 20px; border-radius: 15px; margin-top: 15px;">
            <h4 style="color: #c0a0ff;">💫 Рекомендации</h4>
            <p>${compatibility.advice}</p>
        </div>
        
        <p style="margin-top: 20px; font-size: 12px; color: rgba(255,255,255,0.5); text-align: center;">
            ⚠️ Полная версия синастрии с анализом домов и аспектов будет доступна в следующей версии
        </p>
    `;
}

function showResultTab(tabName) {
    const tabs = document.querySelectorAll('.result-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const natalTab = document.getElementById('natalTabContent');
    const transitsTab = document.getElementById('transitsTabContent');
    const synastryTab = document.getElementById('synastryTabContent');
    
    natalTab.style.display = 'none';
    transitsTab.style.display = 'none';
    synastryTab.style.display = 'none';
    
    if (tabName === 'natal') {
        natalTab.style.display = 'block';
        tabs[0]?.classList.add('active');
    } else if (tabName === 'transits') {
        transitsTab.style.display = 'block';
        tabs[1]?.classList.add('active');
    } else if (tabName === 'synastry') {
        synastryTab.style.display = 'block';
        tabs[2]?.classList.add('active');
    }
}

// Вспомогательные функции для астрологии

function getZodiacSign(month, day) {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей';
    return 'Рыбы';
}

function getElementByZodiac(zodiac) {
    const fire = ['Овен', 'Лев', 'Стрелец'];
    const earth = ['Телец', 'Дева', 'Козерог'];
    const air = ['Близнецы', 'Весы', 'Водолей'];
    const water = ['Рак', 'Скорпион', 'Рыбы'];
    
    if (fire.includes(zodiac)) return 'Огонь 🔥';
    if (earth.includes(zodiac)) return 'Земля 🌍';
    if (air.includes(zodiac)) return 'Воздух 💨';
    return 'Вода 💧';
}

function getZodiacDescription(zodiac) {
    const descriptions = {
        'Овен': 'Энергичный, инициативный, смелый. Вы рождены быть лидером и первооткрывателем.',
        'Телец': 'Надежный, терпеливый, чувственный. Цените стабильность и комфорт.',
        'Близнецы': 'Общительный, любознательный, адаптивный. Ваша стихия — информация и общение.',
        'Рак': 'Чуткий, заботливый, интуитивный. Ваша сила в эмоциональной глубине.',
        'Лев': 'Щедрый, творческий, харизматичный. Вы рождены сиять и вдохновлять.',
        'Дева': 'Аналитичный, практичный, внимательный к деталям. Ваш дар — порядок и служение.',
        'Весы': 'Дипломатичный, справедливый, эстетичный. Ваша миссия — создавать гармонию.',
        'Скорпион': 'Страстный, глубокий, трансформирующий. Ваша сила в умении возрождаться.',
        'Стрелец': 'Оптимистичный, свободолюбивый, философский. Вы ищете истину и смыслы.',
        'Козерог': 'Целеустремленный, ответственный, дисциплинированный. Вы строите прочное будущее.',
        'Водолей': 'Оригинальный, свободомыслящий, гуманистичный. Вы видите будущее раньше других.',
        'Рыбы': 'Эмпатичный, творческий, духовный. Ваш дар — исцеление и сострадание.'
    };
    return descriptions[zodiac] || 'Познавайте себя и свои уникальные качества.';
}

function getMoonSign(date) {
    const signs = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const index = (dayOfYear % 28) % 12;
    return signs[index];
}

function getDailyAspects() {
    const aspects = [
        'Солнце в гармоничном аспекте с Юпитером — день удачен для начинаний',
        'Венера в трине с Нептуном — творческий подъем и романтическое настроение',
        'Меркурий в квадрате с Марсом — будьте осторожны в словах, возможны конфликты',
        'Луна в соединении с Сатурном — время для серьезных размышлений и планирования'
    ];
    return aspects[Math.floor(Math.random() * aspects.length)];
}

function getCompatibility(zodiac1, zodiac2) {
    const compatibilities = {
        'Овен-Овен': { score: 85, desc: 'Яркий союз двух лидеров. Много страсти, но и конкуренции тоже.', advice: 'Учитесь сотрудничать, а не соревноваться.' },
        'Овен-Телец': { score: 70, desc: 'Огонь и Земля: импульсивность встречает стабильность.', advice: 'Овну нужно быть терпеливее, Тельцу — смелее.' },
        'Овен-Близнецы': { score: 90, desc: 'Два энергичных знака. Вместе вам никогда не бывает скучно.', advice: 'Поддерживайте общие проекты и приключения.' },
        'Овен-Рак': { score: 55, desc: 'Сложное сочетание: прямолинейность Овна ранит чувствительного Рака.', advice: 'Раку — говорить о чувствах, Овну — быть мягче.' },
        'Овен-Лев': { score: 95, desc: 'Огненный союз. Взаимное восхищение и поддержка.', advice: 'Не конкурируйте за лидерство, разделите роли.' },
        'Овен-Дева': { score: 60, desc: 'Разные ритмы жизни: Овен спешит, Дева все проверяет.', advice: 'Деве — отпустить контроль, Овну — замедлиться.' },
        'Овен-Весы': { score: 75, desc: 'Противоположности притягиваются. Дополняете друг друга.', advice: 'Цените различия, они ваша сила.' },
        'Овен-Скорпион': { score: 80, desc: 'Сильные личности. Глубокие чувства и страсть.', advice: 'Доверяйте друг другу, не играйте в игры.' },
        'Овен-Стрелец': { score: 95, desc: 'Идеальные партнеры для приключений. Оптимизм и энергия.', advice: 'Путешествуйте вместе, это вас укрепляет.' },
        'Овен-Козерог': { score: 50, desc: 'Разные цели: Овен хочет сейчас, Козерог строит на будущее.', advice: 'Найдите общие долгосрочные цели.' },
        'Овен-Водолей': { score: 85, desc: 'Новаторский союз. Оба ценят свободу и независимость.', advice: 'Давайте друг другу пространство.' },
        'Овен-Рыбы': { score: 65, desc: 'Овен — действие, Рыбы — мечты. Может быть красиво, но непрактично.', advice: 'Рыбам — проявлять инициативу, Овну — слушать.' }
    };
    
    const key = `${zodiac1}-${zodiac2}`;
    const reverseKey = `${zodiac2}-${zodiac1}`;
    const result = compatibilities[key] || compatibilities[reverseKey];
    
    if (result) return result;
    
    return {
        score: 70,
        description: `Союз ${zodiac1} и ${zodiac2} имеет потенциал для гармоничных отношений.`,
        advice: 'Будьте открыты и честны друг с другом.'
    };
}