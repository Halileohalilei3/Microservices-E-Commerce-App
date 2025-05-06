const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Secrets dizininin tam yolunu oluşturun
const secretsPath = path.join(__dirname, '../secrets');

// Dizinin var olduğundan emin olun
if (!fs.existsSync(secretsPath)) {
    fs.mkdirSync(secretsPath, { recursive: true });
}

crypto.generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}, (err, publicKey, privateKey) => {
  if (err) throw err;
  
  fs.writeFileSync(path.join(secretsPath, 'private.pem'), privateKey);
  fs.writeFileSync(path.join(secretsPath, 'public.pem'), publicKey);
  console.log('Keys generated!');
});