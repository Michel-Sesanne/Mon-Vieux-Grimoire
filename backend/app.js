const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/api/books', (req, res, next) => {
  const books = [
    {
      id: 'oeihfzeoi',
      userId: 'qsomihvqios',
      title: 'Mon premier livre',
      author: 'Premier auteur',
      year: 2023,
      imageUrl: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1890&q=80',
      genre: 'fx',
      ratings: {
        userId: 'qsomihvqios',
        grade: 5,
      },
      averageRating: 3,
    },
    {
      id: 'oeihfzeomoihi',
      userId: 'qsomihvqios',
      title: 'Mon deuxième livre',
      author: 'Deuxième auteur',
      year: 1900,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      genre: 'roman',
      ratings: {
        userId: 'qsomihvqios',
        grade: 5,
      },
      averageRating: 4,
    },
  ];
  res.status(200).json(books);
});

app.post('/api/books', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Livre créé !'
  });
});

module.exports = app;