const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    try {
        req.user = { id: jwt.verify(header.split(' ')[1], process.env.JWT_SECRET).id };
        next();
    } catch (err) { res.status(401).json({ error: 'Invalid token' }); }
};