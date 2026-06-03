// Вызывать эту функцию при завершении расклада карт
async function saveCardToDB(cardName, textDescription) {
    const token = localStorage.getItem('astroToken');
    if (!token) return; // Если гость — молча игнорим

    await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            type: 'Таро',
            data: { card: cardName, text: textDescription }
        })
    }).catch(err => console.log('History save failed'));
}