// Imports
const database = require('./../configs/database');
const table = 'race';

// Routes
module.exports = {
    list: function (req, res) {
        const sqlQuery = 'SELECT * FROM `'+ table + '`';
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
    add: async function (req, res) {
        const nom = req.body.nom;
        if (nom == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            const sqlQuery = 'INSERT INTO `'+ table + '` ( `nom`, `statut`, `createAt`, `updateAt`) VALUE (?, 1, NOW(), NOW())';
            const data = await database.query(sqlQuery, [nom])
            return res.status(200).json({
                data: data
            });
        } catch (ex) {
            console.log(error)
            return res.status(500).json({
                error: `Erreur lors la requete ${error}`
            });
        }
    },
    set: function (req, res) {
        const id = req.body.id;
        const nom = req.body.nom;
        if (id == undefined || nom == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'UPDATE `'+ table + '` SET `nom` = ?, `updateAt` = NOW() WHERE `id_race` = ?';
        database.query(sqlQuery, [nom, id])
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
        const id = req.params.id;
        if (id == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'UPDATE `'+ table + '` SET `statut` = 0, `updateAt` = NOW() WHERE `id_race` = ?';
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
    }
};