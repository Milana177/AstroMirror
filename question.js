// ВОПРОС В КОЛОДУ

let currentMajorQuestion = '';
let selectedMajorCards = [];

function setQuestion(question) {
    document.getElementById('userQuestion').value = question;
    currentMajorQuestion = question;
}

function startMajorArcanaReading() {
    if (!checkAuth()) return;
    
    const question = document.getElementById('userQuestion').value;
    if (!question) {
        alert('Пожалуйста, задайте вопрос');
        return;
    }
    
    hideAllForms();
    currentMajorQuestion = question;
    
    selectedMajorCards = [];
    const availableCards = [...majorArcanaCards];
    
    for (let i = 0; i < 3; i++) {
        if (availableCards.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        selectedMajorCards.push(availableCards[randomIndex]);
        availableCards.splice(randomIndex, 1);
    }
    
    document.getElementById('questionInputSection').style.display = 'none';
    document.getElementById('threeCardsContainer').style.display = 'block';
    
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById(`card${i}`);
        card.className = 'card-back';
        card.innerHTML = '';
        card.style.background = 'linear-gradient(135deg, #2a1e3a, #1a1b3a)';
        document.getElementById(`card${i}Meaning`).innerHTML = '';
    }
    document.getElementById('finalAnswer').innerHTML = '';
}

function revealMajorArcana(cardNumber) {
    const card = document.getElementById(`card${cardNumber}`);
    const meaningDiv = document.getElementById(`card${cardNumber}Meaning`);
    
    if (card.classList.contains('revealed')) return;
    
    card.classList.add('revealed');
    
    const cardData = selectedMajorCards[cardNumber-1];
    
    const imagePath = `images/tarot/${cardData.fileName}.png`;
    
    card.innerHTML = `
        <img src="${imagePath}" 
             alt="${cardData.name}" 
             style="width: 100%; height: 100%; object-fit: cover; border-radius: 13px;"
             onerror="this.onerror=null; this.innerHTML='<div style=\'display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; color: #c0a0ff;\'><div style=\'font-size: 48px;\'>${cardData.image || '🎴'}</div><div style=\'font-size: 16px; margin-top: 10px;\'>${cardData.name}</div></div>'">
    `;
    
    const positions = [
        'Эта карта показывает корни ситуации: ',
        'Эта карта дает совет: ',
        'Эта карта показывает вероятный исход: '
    ];
    
    meaningDiv.innerHTML = positions[cardNumber-1] + cardData.meaning;
    
    const allRevealed = [1,2,3].every(num => 
        document.getElementById(`card${num}`).classList.contains('revealed')
    );
    
    if (allRevealed) {
        const finalAnswer = document.getElementById('finalAnswer');
        const answer = generateMajorArcanaAnswer(selectedMajorCards);
        
        finalAnswer.innerHTML = `
            <h3 style="color: #c0a0ff; margin-bottom: 15px;">🔮 Ответ на ваш вопрос</h3>
            <p style="font-size: 20px; margin-bottom: 20px; font-style: italic; color: rgba(255,255,255,0.9);">"${currentMajorQuestion}"</p>
            <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
                <p style="font-size: 18px; line-height: 1.6;">${answer}</p>
                <p style="margin-top: 15px; font-size: 14px;">✨ Ваши карты: ${selectedMajorCards[0].name}, ${selectedMajorCards[1].name}, ${selectedMajorCards[2].name}</p>
            </div>
        `;
        
        saveToHistory('majorArcana', { 
            question: currentMajorQuestion,
            cards: selectedMajorCards.map(c => c.name),
            answer: answer
        });
    }
}

function generateMajorArcanaAnswer(cards) {
    const answers = [
        `Судьба говорит через ${cards[0].name} (прошлое), ${cards[1].name} (настоящее) и ${cards[2].name} (будущее). ${cards[1].meaning.split('.')[0]}. Это ключ к вашему вопросу.`,
        `Расклад показывает: в прошлом ${cards[0].name.toLowerCase()}, сейчас ${cards[1].name.toLowerCase()}, а будущее готовит ${cards[2].name.toLowerCase()}. ${cards[1].meaning}`,
        `Карты отвечают: ${cards[0].name} указывает на истоки, ${cards[1].name} дает мудрый совет, а ${cards[2].name} показывает итог. ${cards[1].meaning}`,
        `Ваш путь: ${cards[0].name} → ${cards[1].name} → ${cards[2].name}. ${cards[1].name} говорит: "${cards[1].meaning}"`,
        `Сейчас для вас важно: ${cards[1].meaning.split('.')[0]}. Прошлое (${cards[0].name}) и будущее (${cards[2].name}) лишь фон для главного решения.`
    ];
    return answers[Math.floor(Math.random() * answers.length)];
}

function resetMajorArcana() {
    document.getElementById('questionInputSection').style.display = 'block';
    document.getElementById('threeCardsContainer').style.display = 'none';
    document.getElementById('userQuestion').value = '';
    currentMajorQuestion = '';
    selectedMajorCards = [];
}