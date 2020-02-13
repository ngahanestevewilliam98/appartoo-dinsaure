// Imports
const database = require('./../configs/database');
const table = 'amis';

// Routes
module.exports = {
    list: function (req, res) {
        const id_din = req.params.id_din;
        if (id_din == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'SELECT amis.id_ami, dinosaure.id_donosaure, dinosaure.code, dinosaure.age, dinosaure.nourriture FROM `amis` INNER JOIN `dinosaure` ON (amis.id_din2 = dinosaure.id_donosaure) WHERE amis.id_din1 = ? AND amis.statut = 1';
        database.query(sqlQuery, [id_din])
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
        const id_din1 = req.body.id_din1;
        const code_din2 = req.body.code_din2;
        if (id_din1 == undefined || code_din2 == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            let sqlQuery0 = 'SELECT `id_donosaure` FROM `dinosaure` WHERE `code` = ? AND `id_donosaure` != ? LIMIT 1';
            const data0 = await database.query(sqlQuery0, [code_din2, id_din1])
            if (data0.length === 1) {
                const id_din2 = data0[0].id_donosaure;
                let sqlQuery1 = 'SELECT * FROM `' + table + '` WHERE `id_din1` = ? AND `id_din2` = ? LIMIT 1';
                const data1 = await database.query(sqlQuery1, [id_din1, id_din2])
                if (data1.length === 0) {
                    const sqlQuery = 'INSERT INTO `' + table + '` (`id_din1`, `id_din2`, `statut`, `createAt`, `updateAt`) VALUE (?, ?, ?, NOW(), NOW())';
                    const data = await database.query(sqlQuery, [id_din1, id_din2, 1])
                    return res.status(200).json({
                        data: data
                    });
                } else {
                    let sqlQuery2 = 'UPDATE `' + table + '` SET `statut` = ? WHERE `id_din1` = ? AND `id_din2` = ? ';
                    const data = await database.query(sqlQuery2, [1, id_din1, id_din2])
                    return res.status(200).json({
                        data: data
                    });
                }
            } else {
                return res.status(500).json({
                    error: `Dinosaure inexistant`
                });
            }
        } catch (ex) {
            console.log(ex)
            return res.status(500).json({
                error: `Erreur lors la requete ${error}`
            });
        }
    },
    del: function (req, res) {
        const id = req.params.id;
        if (id == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        let sqlQuery = 'UPDATE `' + table + '` SET `statut` = 0, `updateAt` = NOW() WHERE `id_ami` = ?';
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