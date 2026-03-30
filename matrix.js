// МАТРИЦА СУДЬБЫ

function showMatrixForm() {
    if (!checkAuth()) return;
    hideAllForms();
    document.getElementById('matrixFormContainer').style.display = 'block';
}

function calculateMatrix() {
    const name = document.getElementById('matrixName').value || currentUser?.name || 'Аноним';
    const date = document.getElementById('matrixDate').value;
    
    if (!date) {
        alert('Пожалуйста, введите дату рождения');
        return;
    }

    const [year, month, day] = date.split('-').map(Number);
    
    const birthArcane = ((day + month + year) % 22) || 22;
    const destinyArcane = ((day + month) % 22) || 22;
    const talentArcane = ((month + year) % 22) || 22;
    const purposeArcane = ((day + month + year + 7) % 22) || 22;

    const result = document.getElementById('matrixResult');
    result.innerHTML = `
        <h3 style="color: #c0a0ff; margin-bottom: 20px;">🔢 Матрица судьбы ${name}</h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; color: #c0a0ff;">${birthArcane}</div>
                <div>Аркан рождения</div>
                <div style="font-size: 12px;">${getArcaneName(birthArcane)}</div>
            </div>
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; color: #c0a0ff;">${destinyArcane}</div>
                <div>Аркан судьбы</div>
                <div style="font-size: 12px;">${getArcaneName(destinyArcane)}</div>
            </div>
            <div style="background: rgba(192,160,255,0.1); padding: 15px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; color: #c0a0ff;">${talentArcane}</div>
                <div>Аркан таланта</div>
                <div style="font-size: 12px;">${getArcaneName(talentArcane)}</div>
            </div>
        </div>

        <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
            <h4 style="color: #c0a0ff; margin-bottom: 10px;">🌟 Ваше предназначение:</h4>
            <p>${getArcaneDescription(purposeArcane)}</p>
        </div>
    `;
    result.classList.add('visible');
    saveToHistory('matrix', { name, date, birthArcane, destinyArcane, talentArcane });
}

function getArcaneName(num) {
    const names = {
        1: 'Маг', 2: 'Верховная Жрица', 3: 'Императрица', 4: 'Император',
        5: 'Иерофант', 6: 'Влюбленные', 7: 'Колесница', 8: 'Сила',
        9: 'Отшельник', 10: 'Колесо Фортуны', 11: 'Справедливость', 12: 'Повешенный',
        13: 'Смерть', 14: 'Умеренность', 15: 'Дьявол', 16: 'Башня',
        17: 'Звезда', 18: 'Луна', 19: 'Солнце', 20: 'Суд', 21: 'Мир', 22: 'Шут'
    };
    return names[num] || 'Маг';
}

function getArcaneDescription(num) {
    const desc = {
        1: 'Быть первооткрывателем, реализовывать идеи, учиться манифестировать реальность.',
        2: 'Развивать интуицию, доверять внутреннему голосу, изучать тайны.',
        3: 'Создавать красоту, заботиться о близких, развивать творчество.',
        4: 'Строить стабильные системы, нести ответственность, быть лидером.',
        5: 'Передавать знания, быть наставником, следовать традициям.',
        6: 'Делать выбор сердцем, учиться любить, строить отношения.',
        7: 'Двигаться вперед, преодолевая препятствия, контролировать ситуацию.',
        8: 'Проявлять силу духа и внутреннюю мощь, побеждать страхи.',
        9: 'Искать мудрость в уединении, познавать себя, быть самодостаточным.',
        10: 'Принимать перемены как часть пути, следовать за удачей.',
        11: 'Восстанавливать справедливость, принимать решения, отвечать за поступки.',
        12: 'Смотреть на мир под другим углом, ждать, приносить жертвы.',
        13: 'Отпускать старое, трансформироваться, возрождаться.',
        14: 'Находить баланс, быть умеренным, сочетать противоположности.',
        15: 'Познавать теневые стороны, трансформировать страхи.',
        16: 'Разрушать иллюзии, строить заново, проходить через кризисы.',
        17: 'Верить в лучшее, вдохновлять других, надеяться.',
        18: 'Исследовать подсознание, работать со страхами, доверять интуиции.',
        19: 'Нести свет и радость, быть счастливым, реализовывать потенциал.',
        20: 'Подводить итоги, перерождаться, просыпаться.',
        21: 'Достигать гармонии с миром, быть целостным.',
        22: 'Начинать все с чистого листа, быть спонтанным, доверять жизни.'
    };
    return desc[num] || 'Познавать себя и мир вокруг';
}