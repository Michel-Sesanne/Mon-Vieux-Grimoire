const express = require('express'); // framework Node.js pour la création d'applications web
const mongoose = require('mongoose'); // bibliothèque pour interagir avec une base de données MongoDB
const path = require('path'); // module Node.js pour la gestion des chemins de fichiers et de répertoires

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// Etablir une connexion à une base de données MongoDB
mongoose.connect('mongodb+srv://michel16anne:ocrP7@cluster0.orefawd.mongodb.net/?retryWrites=true&w=majority', //identifiants de connexion et URL de la bdd
  { useNewUrlParser: true,
    useUnifiedTopology: true }) // options spécifiées pour assurer une connexion appropriée à la bdd
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // Crée une instance d'Express.js

        // Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ajout en-tête CORS pour accéder à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // définit les en-têtes autorisés
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // définit les méthodes HTTP autorisées
  next(); // active le middleware CORS
});
        // Middleware pour analyser le corps des requêtes HTTP au format JSON
app.use(express.json()); // (Express prend toutes les requêtes qui ont comme Content-Type 'application/json' et met à disposition leur 'body' directement sur l'objet req)

//La méthode app.use() permet d'attribuer un middleware à une route spécifique de l'application
app.use('/api/books', bookRoutes); // Associe les routes définies dans le module "bookRoutes" à l'URL "/api/books"
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); // associe le chemin au répertoire statique, permet de servir les fichiers image statiques en utilisant Express.js

module.exports = app;