import express from "express";
import { isAuthenticatedAdmin } from "../../middlewares";
import { createTypeVehicleAction, deleteTypeVehicleAction, getAllTypeVehicleAction, getTypeVehicleByIdAction, updateTypeVehicleByIdAction } from "../../controller/typeVehicle";

export default (router:express.Router)=>{
    router.get('/type-vehicle', getAllTypeVehicleAction);
    router.post('/type-vehicle',isAuthenticatedAdmin, createTypeVehicleAction);
    router.put('/type-vehicle/:id',isAuthenticatedAdmin, updateTypeVehicleByIdAction);
    router.delete('/type-vehicle/:id',isAuthenticatedAdmin, deleteTypeVehicleAction);
    router.get('/type-vehicle/:id', getTypeVehicleByIdAction);
};