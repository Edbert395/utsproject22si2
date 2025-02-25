const { verifyToken } = require('../config/auth');
const authMiddleware = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const validateTask = (req, res, next) => {
    const { title, category, deadline, status } = req.body;

    if (!title || !category || !deadline || !status) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    next();
};

module.exports = {authMiddleware, validateTask};