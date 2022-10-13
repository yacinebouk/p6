const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const validator = require('validator');

/* Fonction d'inscription */ 
exports.signup = (req, res, next) => {
    // Vérification de la validité de l'adresse email et salage du mot de passe
    if(validator.isEmail(req.body.email, {blacklisted_chars: '$="'})) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                    .catch(error => res.status(400).json({ error }));
            })
    } else {
        res.status(400).json({ error: "Le format de l'adresse email est invalide"});
    }
};

/* Fonction de connexion */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérification de l'email utilisateur
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur inconnu'});
            } else {
            // Vérification du mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect'});
                    } else {
                        // Si ok validation de la connexion et attribution d'un token d'authentifcation
                        let token = jwt.sign(
                            {userId: user._id},
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }                        
                        );
                        res.status(200).json({
                            userId: user._id,
                            token: token
                        });
                    }
                })
                .catch(error => res.status(500).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ error }));
};