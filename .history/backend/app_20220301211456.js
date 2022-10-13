require('dotenv').config();

const express = require ('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

// Protection contre certaines vulnérabilité connues
app.use(helmet());

// Connexion à la base de données
mongoose.connect('mongodb+srv://' + process.env.MDB_user + ':' + process.env.MDB_pw + '@pfdw13.egmg9.mongodb.net/pfdw13piiquante?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Pour empêcher les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

// Protection contre l'injection en remplaçant les caractères interdits
app.use(mongoSanitize({
    replaceWith: '_'
}));

// Définition des accès principaux
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;