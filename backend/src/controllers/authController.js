const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const tokenGen = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const [reslt] = await pool.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hash]);
        res.status(201).json({ token: tokenGen(reslt.insertId), user: { id: reslt.insertId, name, email } });
    } catch (err) { res.status(400).json({ error: "Email уже занят" }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ error: "Неверные данные" });
        res.json({ token: tokenGen(rows[0].id), user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
    } catch (err) { res.status(500).json({ error: "Ошибка сервера" }); }
};

exports.getMe = async (req, res) => {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: "Не найден" });
};