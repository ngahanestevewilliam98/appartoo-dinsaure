// Imports
const database = require('../configs/mongodb');
const collection = 'dinosaure';
const md5 = require('md5');

// Routes
module.exports = {
    list: async function (req, res) {
        const email = req.params.email;
        if (email == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            const data = await database.selectOne(collection, email);
            const amis = data.amis;
            const users = [];
            const emalU = [];
            for (let index = 0; index < amis.length; index++) {
                const oo = await database.selectOne(collection, amis[index]);
                if (oo) {
                    users.push(oo);
                    emalU.push(oo.email)
                }
            }
            return res.status(200).json({
                data: users,
                emailAmi: emalU
            });
        } catch (ex) {
            return res.status(500).json({
                error: `Erreur lors la requete ${error}`
            });
        }
    },
    add: async function (req, res) {
        const emailAmi = req.body.emailAmi;
        const user = req.body.user;
        if (emailAmi == undefined || user == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            const data = await database.selectOne(collection, emailAmi);
            if (data) {
                let fd = JSON.parse(user.amis);
                console.log(fd)
                const dc = fd.find(element => element == emailAmi);
                if (dc) {
                    return res.status(500).json({
                        error: `Dinosaure vous etes deja amis`
                    });
                } else {
                    fd.push(emailAmi)
                    user.amis = fd;
                    delete user._id;
                    const data2 = await database.update(collection, {
                        email: user.email
                    }, user);
                    return res.status(200).json({
                        data: data2
                    });
                }
            } else {
                return res.status(404).json({
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
    del: async function (req, res) {
        const emailAmi = req.body.emailAmi;
        const user = req.body.user;
        if (emailAmi == undefined || user == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        try {
            let fd = JSON.parse(user.amis);
            let fc = [];
            fd.forEach(element => {
                if (element != emailAmi) {
                    fc.push(element)
                }
            });
            user.amis = fc;
            delete user._id;
            const data2 = await database.update(collection, {
                email: user.email
            }, user);
            return res.status(200).json({
                data: data2
            });
        } catch (ex) {
            console.log(ex)
            return res.status(500).json({
                error: `Erreur lors la requete ${error}`
            });
        }
    },
    createAndAddAmis: function (req, res) {
        const race = req.body.race;
        const email = req.body.email;
        const password = req.body.password;
        const nourriture = req.body.nourriture;
        const age = req.body.age;
        const user1 = req.body.user1;
        if (user1 == undefined || race == undefined || email == undefined || password == undefined || nourriture == undefined || age == undefined) res.send(404, {
            error: 'Paramètres incomplets'
        });
        // database.selectOne(collection, email)
        //     .then(data => {
        // if (data) {
        //     console.log('d1');
        //     return res.status(404).json({
        //         error: `Dinosaure deja existant`
        //     });
        // } else {
        //     console.log('d2');
        const item = {
            email,
            password: md5(password),
            statut: 1,
            age,
            race,
            amis: [user1.email],
            nourriture,
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString()
        }
        database.createOne(collection, item)
            .then(data2 => {
                console.log('d3');
                // return res.status(200).json({
                //     data: data2
                // });
                let fd = JSON.parse(user1.amis);
                fd.push(email);
                user1.amis = fd;
                delete user1._id;
                console.log(user1)
                database.update(collection, {
                        email: user1.email
                    }, user1)
                    .then(data3 => {
                        return res.status(200).json({
                            data: data3
                        });
                    }, error => {
                        console.log(error)
                        return res.status(500).json({
                            error: `Erreur lors la requete ${error}`
                        });
                    });
            }, error => {
                console.log('d6');
                return res.status(500).json({
                    error: `Erreur lors la requete ${error}`
                });
            });
        //     }
        // }, error => {
        //     console.log('d6');
        //     return res.status(500).json({
        //         error: `Erreur lors la requete ${error}`
        //     });
        // });
    },
};