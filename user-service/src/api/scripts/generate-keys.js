const crypto = require('crypto');
const fs = require('fs');

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
  
  fs.writeFileSync('../secrets/private.pem', privateKey);
  fs.writeFileSync('../secrets/public.pem', publicKey);
  console.log('Keys generated!');
});