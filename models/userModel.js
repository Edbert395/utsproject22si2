const db = require('../config/db'); 
const bcrypt = require('bcryptjs');

const User = {
    create: async (username, password) => { 
        const hashedPassword = await bcrypt.hash(password, 10); 
        const [result] = await db.promise().query( 
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        ); 
        return result.insertId;
    }, 
    findByUsername: async (username) => {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', 
        [username]); 
        return rows[0]; 
    } 
};

module.exports = User;