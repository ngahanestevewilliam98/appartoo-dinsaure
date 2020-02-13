// Imports
const express = require('express');

// Middleware
const access = require('../middlewares/access');

/* GET, POST, PUT, DELETE REQUEST */
const dinosauresCtrl = require('../controllers/dinosaures');
const amisCtrl = require('../controllers/amis');
const raceCtrl = require('../controllers/race');

// Router
exports.router = (function () {

    let apiRouter = express.Router();

    /* Dinosaure routes */
    apiRouter.route('/dinosaure/list').get(access, dinosauresCtrl.list);
    apiRouter.route('/dinosaure/getbyiD_RACE/:id').get(access, dinosauresCtrl.getbyiD_RACE);
    apiRouter.route('/dinosaure/connect/:code/:password').get(access, dinosauresCtrl.connect);
    apiRouter.route('/dinosaure/recuvar/:code').get(access, dinosauresCtrl.recuvar);
    apiRouter.route('/dinosaure/add').post(access, dinosauresCtrl.add);
    apiRouter.route('/dinosaure/set').post(access, dinosauresCtrl.set);
    apiRouter.route('/dinosaure/del/:id').delete(access, dinosauresCtrl.del);

    /* Race routes */
    apiRouter.route('/amis/list/:id_din').get(access, amisCtrl.list);
    apiRouter.route('/amis/add').post(access, amisCtrl.add);
    apiRouter.route('/amis/del/:id').get(access, amisCtrl.del);


    /* Race routes */
    apiRouter.route('/race/list').get(access, raceCtrl.list);
    apiRouter.route('/race/add').post(access, raceCtrl.add);
    apiRouter.route('/race/set').put(access, raceCtrl.set);
    apiRouter.route('/race/del/:id').delete(access, raceCtrl.del);



    return apiRouter;

})();