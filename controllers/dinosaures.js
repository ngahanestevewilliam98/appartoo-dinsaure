// Imports
const database = require('./../configs/database');
const number = require('../helpers/number');
const mailer = require('../helpers/mailer');
const table = 'dinosaure';
const md5 = require('md5');

// Routes
module.exports = {
    list: function (req, res) {
        let sqlQuery = 'SELECT * FROM `' + table + '` WHERE `statut` = 1 ORDER BY `id_donosaure` DESC';
        database.query(sqlQuery)
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
    getbyiD_RACE: function (req, res) {
        const id = req.params.idrace;
        if (id == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'SELECT * FROM `' + table + '` WHERE `id_race` = ? AND `statut` = 1';
        database.query(sqlQuery, [id])
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
        const idrace = req.body.idrace;
        const code = req.body.code;
        const password = req.body.password;
        const nourriture = req.body.nourriture;
        const age = req.body.age;
        if (idrace == undefined || code == undefined || password == undefined || nourriture == undefined || age == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            let sqlQuery0 = 'SELECT * FROM `' + table + '` WHERE `code` = ? LIMIT 1';
            const data0 = await database.query(sqlQuery0, [code])
            if (data0.length === 0) {
                const sqlQuery = 'INSERT INTO `' + table + '` (`code`, `password`, `statut`, `age`, `id_race`,`nourriture`, `createAt`, `updateAt`) VALUE (?, ?, ?, ?, ?, ?, NOW(), NOW())';
                let data = await database.query(sqlQuery, [code, md5(password), 1, age, idrace, nourriture])
                return res.status(200).json({
                    data: data
                });
            } else {
                return res.status(500).json({
                    error: `Dinosaure existant`
                });
            }
        } catch (ex) {
            console.log(ex)
            return res.status(500).json({
                error: `Erreur lors la requete ${error}`
            });
        }
    },
    set: function (req, res) {
        const id = req.body.id;
        const code = req.body.code;
        const password = req.body.password;
        const age = req.body.age;
        const idrace = req.body.idrace;
        const nourriture = req.body.nourriture;
        if (id == undefined || code == undefined || password == undefined || age == undefined || idrace == undefined || nourriture == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'UPDATE `' + table + '` SET `code` = ?, `password` = ?, `age` = ?, `id_race` = ?, `nourriture` = ?, `updateAt` = NOW() WHERE `id_donosaure` = ?';
        database.query(sqlQuery, [code, md5(password), age, idrace, nourriture, id])
            .then(data => {
                return res.status(200).json({
                    data: data
                });
            }, error => {
                console.log(error);
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
    },
    del: function (req, res) {
        let id = req.params.id;
        if (id == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'UPDATE `' + table + '` SET `statut` = 0 WHERE `id_donosaure` = ?';
        database.query(sqlQuery, [id])
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
    connect: function (req, res) {
        let code = req.params.code;
        let password = req.params.password;
        if (code == undefined || password == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'SELECT * FROM `' + table + '` WHERE `code` = ? AND `password` = ? AND `statut` = 1 LIMIT 1';
        database.query(sqlQuery, [code, md5(password)])
            .then(data => {
                if (data.length == 1) {
                    return res.status(202).json({
                        data: data[0]
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
    recuvar: function (req, res) {
        let email = req.params.email;
        if (email == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'SELECT * FROM `' + table + '` WHERE `code` = ? AND `statut` = 1 LIMIT 1';
        database.query(sqlQuery, [email])
            .then(data => {
                if (data.length == 1) {
                    let sqlQuery1 = 'UPDATE `' + table + '` SET `password` = ? WHERE `code` = ?';
                    const newP = `${number.genNumber(11111111, 99999999)}`;
                    const nom_complet = data[0].nom_complet;
                    database.query(sqlQuery1, [md5(newP), email])
                        .then(data => {
                            try {
                                const titleMsg = 'Appartoo : Réinitialisation du mot de passe';
                                const bodyMsg = `M./Mme  ${nom_complet}, votre nouveau mot de passe  est ${newP}`;
                                // mailer.sendDev(email, titleMsg, bodyMsg);
                                mailer.sendProd(email, titleMsg, bodyMsg);
                                return res.status(202).json({
                                    data: data
                                });
                            } catch (error) {
                                res.send(500, {
                                    data: error
                                });
                            }
                        }, error => {
                            return res.status(500).json({
                                error: `Erreur lors la requete ${error}`
                            });
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
};