// Imports
const database = require('../configs/mongodb');
const number = require('../helpers/number');
const mailer = require('../helpers/mailer');
const table = 'dinosaure';
const collection = 'dinosaure';
const md5 = require('md5');

// Routes
module.exports = {
    list: function (req, res) {
        database.select(collection)
            .then(data => {
                return res.status(200).json({
                    data: data
                });
            }, error => {
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
    },
    add: async function (req, res) {
        const race = req.body.race;
        const email = req.body.code;
        const password = req.body.password;
        const nourriture = req.body.nourriture;
        const age = req.body.age;
        if (race == undefined || email == undefined || password == undefined || nourriture == undefined || age == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        database.selectOne(collection, email)
            .then(data => {
                if (data) {
                    return res.status(404).json({
                        error: `Dinosaure deja existant`
                    });
                } else {
                    const item = {
                        email,
                        password: md5(password),
                        statut: 1,
                        age,
                        race,
                        amis: [],
                        nourriture,
                        createAt: new Date().toISOString(),
                        updateAt: new Date().toISOString()
                    }
                    database.createOne(collection, item)
                        .then(data2 => {
                            return res.status(200).json({
                                data: data2
                            });
                        }, error => {
                            return res.status(500).json({
                                error: `Erreur lors la requete ${error}`
                            });
                        });
                }
            }, error => {
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
    },
    set: function (req, res) {
        const user = req.body.user;
        if (user == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        user.updateAt = new Date().toISOString();
        delete user._id;
        database.update(collection, {
                email: user.email
            }, user)
            .then(data => {
                return res.status(200).json({
                    data: data
                });
            }, error => {
                console.log(error)
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
    },
    connect: function (req, res) {
        let email = req.params.email;
        let password = req.params.password;
        if (email == undefined || password == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        database.connect(collection, email, md5(password))
            .then(data => {
                if (data) {
                    return res.status(200).json({
                        data: data
                    });
                } else {
                    return res.status(404).json({
                        error: `Dinosaure inexistant ou bloqué`
                    });
                }
            }, error => {
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
    },
    recuvar: function (req, res) { // to do
        let email = req.params.email;
        if (email == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        const newP = `${number.genNumber(11111111, 99999999)}`;
        const titleMsg = 'Appartoo : Réinitialisation du mot de passe';
        const bodyMsg = `M./Mme  ${email}, votre nouveau mot de passe  est ${newP}`;
        // mailer.sendDev(email, titleMsg, bodyMsg);
        mailer.sendProd(email, titleMsg, bodyMsg);
        return res.status(202).json({});
    },
};