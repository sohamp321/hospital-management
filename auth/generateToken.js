const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, "soham", {
        expiresIn: '30d',
    });
}
module.exports = generateToken;