const pool = require('../config/db');

exports.addHistory = async (req, res) => {
    try {
        const { type, data, rating } = req.body;
        await pool.execute('INSERT INTO history (user_id, type, data, rating) VALUES (?, ?, ?, ?)', [req.user.id, type, JSON.stringify(data), rating || 0]);
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: "Ошибка сохранения" }); }
};

exports.getUserHistory = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, type, data, is_favorite, rating, created_at FROM history WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(rows.map(r => ({ ...r, data: typeof r.data === 'string' ? JSON.parse(r.data) : r.data })));
    } catch (err) { res.status(500).json({ error: "Ошибка сервера" }); }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.execute('UPDATE history SET is_favorite = NOT is_favorite WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true, message: "Статус избранного обновлен" });
    } catch (err) { res.status(500).json({ error: "Ошибка при изменении статуса" }); }
};