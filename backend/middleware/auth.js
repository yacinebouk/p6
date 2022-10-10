require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupération du token d'authentification
        const token = req.headers.authorization.split(' ')[1];
        // Décodage du token
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        // Récupération du userId encodé dans le token
        const userId = decodedToken.userId;

        // Comparaison du userId de la requête et celui du token
        if(req.body.userId && req.body.userId !== userId) {
            res.status(403).json({ message: 'Requête non autorisée' });
        } else {
            next();
        }
    }
    catch(error) {
        res.status(401).json({ error: new Error('Requête invalide')})
    }
};