const crypto = require('crypto');

// Génère une clé secrète JWT aléatoire de 32 octets (256 bits)
const generateRandomJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const jwtSecret = generateRandomJWTSecret();

console.log(`JWT_SECRET: ${jwtSecret}`);

//Commande "node generate-jwt-secret.js" pour obtenir une clé aléatoire à stocker dans ".env"