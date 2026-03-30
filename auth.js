// АУТЕНТИФИКАЦИЯ

let currentUser = null;

function loadUser() {
    const savedUser = localStorage.getItem('astroUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
        closeModal('register');
        checkAndRestoreCardOfDay();
    }
}

function updateUIForUser() {
    if (currentUser) {
        document.getElementById('userMenu').style.display = 'flex';
        document.getElementById('userNameDisplay').textContent = currentUser.name;
    } else {
        document.getElementById('userMenu').style.display = 'none';
    }
}

function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('active');
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('active');
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
        checkAndRestoreCardOfDay();
    } else {
        alert('Неверный email или пароль');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('astroUser');
    updateUIForUser();
    openModal('register');
    hideAllForms();
}

function hideAllForms() {
    const forms = document.querySelectorAll('.birth-form, .result-card');
    forms.forEach(form => {
        if (form.id !== 'historyContainer') {
            form.style.display = 'none';
        }
    });
    document.getElementById('natalResult')?.classList.remove('visible');
    document.getElementById('matrixResult')?.classList.remove('visible');
    document.getElementById('tarotResult')?.classList.remove('visible');
    document.getElementById('historyContainer')?.classList.remove('visible');
    document.getElementById('questionInputSection').style.display = 'block';
    document.getElementById('threeCardsContainer').style.display = 'none';
}

function checkAuth() {
    if (!currentUser) {
        alert('Пожалуйста, войдите или зарегистрируйтесь');
        openModal('register');
        return false;
    }
    return true;
}