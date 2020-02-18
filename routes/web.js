// Imports
const express = require('express');

// Middleware
const access = require('../middlewares/access');

/* GET, POST, PUT, DELETE REQUEST */
const dinosauresCtrl = require('../controllers/dinosaures');
const amisCtrl = require('../controllers/amis');

// Router
exports.router = (function () {

    let apiRouter = express.Router();

    /* Dinosaure routes */
    apiRouter.route('/dinosaure/list').get(access, dinosauresCtrl.list);
    apiRouter.route('/dinosaure/connect/:email/:password').get(access, dinosauresCtrl.connect);
    apiRouter.route('/dinosaure/recuvar/:email').get(access, dinosauresCtrl.recuvar);
    apiRouter.route('/dinosaure/add').post(access, dinosauresCtrl.add);
    apiRouter.route('/dinosaure/set').post(access, dinosauresCtrl.set);
    
    /* Race routes */
    apiRouter.route('/amis/list/:email').get(access, amisCtrl.list);
    apiRouter.route('/amis/createAndAddAmis').post(access, amisCtrl.createAndAddAmis);
    apiRouter.route('/amis/add').post(access, amisCtrl.add);
    apiRouter.route('/amis/del').post(access, amisCtrl.del);



    return apiRouter;

})();