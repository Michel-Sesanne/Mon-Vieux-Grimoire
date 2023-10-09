const jwt = require('jsonwebtoken');    // Bibliothèque pour créer, vérifier et déchiffrer les JSON Web Tokens
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  // le "[0]" étant "Bearer"
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {        //ajoute un objet "auth" à l'objet de requête "req" avec l'identifiant de l'utilisateur extrait du token
            userId: userId
        };
    next();
    } catch(error) {
        res.status(401).json({ error });
    }
};
