// ВОПРОС В КОЛОДУ

let currentMajorQuestion = '';
let selectedMajorCards = [];

function setQuestion(question) {
    const textarea = document.getElementById('userQuestion');
    if (textarea) {
        textarea.value = question;
    }
    currentMajorQuestion = question;
}

function startMajorArcanaReading() {
    if (!checkAuth()) return;
    
    const question = document.getElementById('userQuestion').value;
    if (!question) {
        alert('Пожалуйста, задайте вопрос');
        return;
    }
    
    if (typeof hideAllForms === 'function') hideAllForms();
    currentMajorQuestion = question;
    
    selectedMajorCards = [];
    const availableCards = [...majorArcanaCards];
    
    for (let i = 0; i < 3; i++) {
        if (availableCards.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        selectedMajorCards.push(availableCards[randomIndex]);
        availableCards.splice(randomIndex, 1);
    }
    
    const questionSection = document.getElementById('questionInputSection');
    const threeCardsContainer = document.getElementById('threeCardsContainer');
    if (questionSection) questionSection.style.display = 'none';
    if (threeCardsContainer) threeCardsContainer.style.display = 'block';
    
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById(`card${i}`);
        const meaningDiv = document.getElementById(`card${i}Meaning`);
        if (card) {
            card.className = 'card-back';
            card.innerHTML = '';
            card.style.background = 'linear-gradient(135deg, #2a1e3a, #1a1b3a)';
        }
        if (meaningDiv) meaningDiv.innerHTML = '';
    }
    
    const finalAnswer = document.getElementById('finalAnswer');
    if (finalAnswer) finalAnswer.innerHTML = '';
}

function revealMajorArcana(cardNumber) {
    const card = document.getElementById(`card${cardNumber}`);
    const meaningDiv = document.getElementById(`card${cardNumber}Meaning`);
    
    if (!card || !meaningDiv) return;
    if (card.classList.contains('revealed')) return;
    
    card.classList.add('revealed');
    
    const cardData = selectedMajorCards[cardNumber-1];
    if (!cardData) return;
    
    card.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; color: #c0a0ff; text-align: center; padding: 10px;">
            <div style="font-size: 64px;">${cardData.image || '🎴'}</div>
            <div style="font-size: 20px; margin-top: 10px; font-weight: bold;">${cardData.name}</div>
        </div>
    `;
    
    const positions = [
        'Эта карта показывает корни ситуации: ',
        'Эта карта дает совет: ',
        'Эта карта показывает вероятный исход: '
    ];
    
    meaningDiv.innerHTML = positions[cardNumber-1] + cardData.meaning;
    
    const allRevealed = [1,2,3].every(num => {
        const c = document.getElementById(`card${num}`);
        return c && c.classList.contains('revealed');
    });
    
    if (allRevealed) {
        const finalAnswer = document.getElementById('finalAnswer');
        const answer = generateMajorArcanaAnswer(selectedMajorCards);
        
        if (finalAnswer) {
            finalAnswer.innerHTML = `
                <h3 style="color: #c0a0ff; margin-bottom: 15px;">🔮 Ответ на ваш вопрос</h3>
                <p style="font-size: 20px; margin-bottom: 20px; font-style: italic; color: rgba(255,255,255,0.9);">"${currentMajorQuestion}"</p>
                <div style="background: rgba(192,160,255,0.2); padding: 20px; border-radius: 15px;">
                    <p style="font-size: 18px; line-height: 1.6;">${answer}</p>
                    <p style="margin-top: 15px; font-size: 14px;">✨ Ваши карты: ${selectedMajorCards[0].name}, ${selectedMajorCards[1].name}, ${selectedMajorCards[2].name}</p>
                </div>
            `;
        }
        
        if (typeof saveToHistory === 'function') {
            saveToHistory('majorArcana', { 
                question: currentMajorQuestion,
                cards: selectedMajorCards.map(c => c.name),
                answer: answer
            });
        }
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
    const questionSection = document.getElementById('questionInputSection');
    const threeCardsContainer = document.getElementById('threeCardsContainer');
    const userQuestion = document.getElementById('userQuestion');
    
    if (questionSection) questionSection.style.display = 'block';
    if (threeCardsContainer) threeCardsContainer.style.display = 'none';
    if (userQuestion) userQuestion.value = '';
    
    currentMajorQuestion = '';
    selectedMajorCards = [];
}

console.log('question.js загружен');
