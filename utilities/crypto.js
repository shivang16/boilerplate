const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);

const encrypt = function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

const decrypt = function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted
}

module.exports = {encrypt,decrypt};
