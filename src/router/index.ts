import express from 'express';
import authentication from './route/authentication';
import user from './route/user';
import group from './route/group';
import vehicleSearch from './route/booking';
import typeVehicle from './route/typeVehicle';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    group(router);
    vehicleSearch(router);
    typeVehicle(router);
    return router;
}