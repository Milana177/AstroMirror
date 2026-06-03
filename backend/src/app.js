const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const auth = require('./controllers/authController');
const history = require('./controllers/historyController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const validate = (req, res, next) => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ error: "Заполните поля корректно" });
    next();
};

app.post('/api/auth/register', [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty()], validate, auth.register);
app.post('/api/auth/login', auth.login);
app.get('/api/auth/me', authMiddleware, auth.getMe);

app.post('/api/history', authMiddleware, history.addHistory);
app.get('/api/history', authMiddleware, history.getUserHistory);
app.patch('/api/history/:id/favorite', authMiddleware, history.toggleFavorite);

module.exports = app;