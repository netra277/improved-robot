const config = require('../configuration/config');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const IV_LENGTH = 16;
let key = crypto.createHash('sha256').update(String(config.clientSecretKey)).digest('base64').substr(0, 32);

module.exports = {
    encrypt(text) {
        try{
            let iv = crypto.randomBytes(IV_LENGTH);
            let cipher = crypto.createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        } catch(e){
            console.log('clientId: ', text, 'exception in encryption', e);
        }
        
    },

    decrypt(text) {
        try{
            let textParts = text.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
        catch(e){
            console.log('clientId: ', text, 'exception in decryption: ', e);
        }
    }
}