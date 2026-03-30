// ОСНОВНОЙ ФАЙЛ - ЗВЕЗДЫ И НАВИГАЦИЯ

function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2);
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        starsContainer.appendChild(star);
    }
    console.log('Создано звезд:', 150);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (typeof hideAllForms === 'function') {
            hideAllForms();
        }
    });
});

window.onload = function() {
    console.log('Страница загружена, инициализация...');
    createStars();
    
    if (typeof loadUser === 'function') {
        loadUser();
    } else {
        console.error('loadUser не определена!');
    }
    
    const calcTypeRadios = document.querySelectorAll('input[name="calcType"]');
    if (calcTypeRadios.length) {
        calcTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (typeof updatePartnerFields === 'function') {
                    updatePartnerFields();
                }
            });
        });
    }
    
    console.log('Инициализация завершена');
};
