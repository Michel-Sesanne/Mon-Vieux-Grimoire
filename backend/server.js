const http = require('http'); //importe le module Node.js http, qui permet de créer un serveur HTTP
const app = require('./app');

// fonction qui converti l'entrée en un nb entier, pour normaliser le port sur lequel le seveur écoutera
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//déterminer le port sur lequel le serveur écoutera (variable d'environnement "PORT" ou "4000" par défaut)
const port = normalizePort(process.env.PORT || '4000'); // port 4000 défini dans 'frontend > constants.js'
app.set('port', port); // configure l'application Express pour utiliser le port défini précédemment

// fonction pour gérer les erreurs survenues lors de la tentative d'écoute sur le port par le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  // vérifie le type d'erreur et affiche un message approprié en fonction de l'erreur
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); /* crée un serveur HTTP en utilisant l'application Express 'app'
                                          serveur capable de gérer les requêtes HTTP entrantes */

server.on('error', errorHandler); //ajoute un gestionnaire d'événement pour l'événement 'error' du serveur
server.on('listening', () => {    // idem pour 'listening'
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // affiche un message pour indiquer que le serveur écoute sur un port spécifique une fois que le serveur est prêt
});

server.listen(port);
// démarre effectivement le serveur en l'associant au port spécifié. Le serveur commencera à écouter les requêtes HTTP entrantes sur ce port