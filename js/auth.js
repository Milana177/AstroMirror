// АУТЕНТИФИКАЦИЯ

let currentUser = null;

function loadUser() {
    const savedUser = localStorage.getItem('astroUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
        closeModal('register');
        if (typeof checkAndRestoreCardOfDay === 'function') {
            checkAndRestoreCardOfDay();
        }
    }
    console.log('loadUser завершен, currentUser:', currentUser);
}

function updateUIForUser() {
    if (currentUser) {
        const userMenu = document.getElementById('userMenu');
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userMenu) userMenu.style.display = 'flex';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
    } else {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.style.display = 'none';
    }
}

function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.add('active');
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.remove('active');
}

function switchModal(from, to) {
    closeModal(from);
    openModal(to);
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
    }

    const users = JSON.parse(localStorage.getItem('astroUsers') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('astroUsers', JSON.stringify(users));
    
    currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
    localStorage.setItem('astroUser', JSON.stringify(currentUser));
    
    closeModal('register');
    updateUIForUser();
    alert('Добро пожаловать, ' + name + '! Теперь вам открыты все тайны');
    
    if (typeof checkAndRestoreCardOfDay === 'function') {
        checkAndRestoreCardOfDay();
    }
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Пожалуйста, введите email и пароль');
        return;
    }

    const users = JSON.parse(localStorage.getItem('astroUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem('astroUser', JSON.stringify(currentUser));
        closeModal('login');
        updateUIForUser();
        alert('С возвращением, ' + user.name + '!');
        
        if (typeof checkAndRestoreCardOfDay === 'function') {
            checkAndRestoreCardOfDay();
        }
    } else {
        alert('Неверный email или пароль');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('astroUser');
    updateUIForUser();
    openModal('register');
    if (typeof hideAllForms === 'function') {
        hideAllForms();
    }
}

function hideAllForms() {
    const forms = ['natalFormContainer', 'matrixFormContainer', 'natalResult', 'matrixResult', 'tarotResult', 'historyContainer'];
    forms.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            if (el.classList) el.classList.remove('visible');
        }
    });
    
    const questionInput = document.getElementById('questionInputSection');
    const threeCards = document.getElementById('threeCardsContainer');
    if (questionInput) questionInput.style.display = 'block';
    if (threeCards) threeCards.style.display = 'none';
}

function checkAuth() {
    if (!currentUser) {
        alert('Пожалуйста, войдите или зарегистрируйтесь');
        openModal('register');
        return false;
    }
    return true;
}

console.log('auth.js загружен');
