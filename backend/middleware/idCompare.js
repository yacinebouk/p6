require('dotenv').config();
const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            // Récupération du token d'authentification
            const token = req.headers.authorization.split(' ')[1];
            // Décodage du token
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
            // Récupération du userId encodé dans le token
            const userId = decodedToken.userId;

            // Comparaison du userId de la sauce et celui du token
            if(sauce.userId && sauce.userId !== userId) {
                res.status(403).json({ message: 'Requête non autorisée' });
            } else {
                next();
            }
        })
        .catch(error => {
            res.status(401).json({ error })
        });
}