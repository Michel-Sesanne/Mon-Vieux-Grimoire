const bcrypt = require('bcrypt');       // Pour le hachage sécurisé des mots de passe
const jwt = require('jsonwebtoken');    // Pour générer des jetons JWT pour l'authentification

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  //Le 2ème argument, "10", est le coût du hachage, qui détermine la complexité du hachage. Plus la valeur est élevée, plus le hachage est sécurisé mais prend du temps
     .then(hash => {
        const user = new User({     //Crée un nouvel objet User avec l'adresse e-mail de la requête et le mot de passe haché
            email: req.body.email,
            password: hash
        });
        user.save()     //Enregistre l'utilisateur dans la base de données
         .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
         .catch(error => res.status(400).json({error}));
     })
     .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })     //Recherche un utilisateur dans la base de données en fonction de l'adresse e-mail fournie dans la requête
     .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de pass incorrecte' });
        } else {
            bcrypt.compare(req.body.password, user.password)
             .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de pass incorrecte'})
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                }
             })
             .catch(error => res.status(500).json({ error}));
        }
     })
     .catch(error => res.status(500).json({ error }));     
};